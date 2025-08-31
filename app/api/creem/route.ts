import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import * as crypto from "crypto";

const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET!;

function verifyCreemSignature(payload: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", CREEM_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(signature, "hex")
  );
}

export interface WebhookResponse {
  id: string;
  eventType: string;
  object: {
    request_id: string;
    object: string;
    id: string;
    customer: {
      id: string;
    };
    product: {
      id: string;
      billing_type: string;
    };
    status: string;
    current_period_end_date: string;
    metadata: {
      userId: string;
    };
  };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("creem-signature");

  if (!signature || !verifyCreemSignature(rawBody, signature)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid signature",
      },
      { status: 400 }
    );
  }

  const webhook = (await req.json()) as WebhookResponse;

  const isSubscription = webhook.object.product.billing_type === "recurring";

  if (isSubscription) {
    if (
      webhook.eventType === "subscription.paid" ||
      webhook.eventType === "subscription.active"
    ) {
      await db.user.update({
        where: { id: webhook.object.metadata.userId },
        data: {
          planId: "pro",
          subscriptionStatus: "active",
          subscriptionId: webhook.object.id,
          customerId: webhook.object.customer.id,
          currentPeriodEnd: new Date(webhook.object.current_period_end_date),
        },
      });
    }

    if (webhook.eventType === "subscription.canceled") {
      await db.user.update({
        where: { id: webhook.object.metadata.userId },
        data: {
          subscriptionStatus: "canceled",
          subscriptionId: webhook.object.id,
          customerId: webhook.object.customer.id,
          currentPeriodEnd: new Date(webhook.object.current_period_end_date),
        },
      });
    }

    if (webhook.eventType === "subscription.expired") {
      await db.user.update({
        where: { id: webhook.object.metadata.userId },
        data: {
          subscriptionStatus: "paused",
          subscriptionId: webhook.object.id,
          currentPeriodEnd: new Date(webhook.object.current_period_end_date),
        },
      });
    }

    if (webhook.eventType === "checkout.completed") {
      await db.user.update({
        where: {
          id: webhook.object.metadata.userId,
        },
        data: {
          currentPeriodEnd: new Date(webhook.object.current_period_end_date),
        },
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: "Webhook received successfully",
  });
}
