import * as crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

if (!process.env.CREEM_WEBHOOK_SECRET) {
  throw new Error("Missing CREEM_API_KEY in environment variables");
}

const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET;

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
    subscription: {
      id: string;
      current_period_end_date: string;
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

  if (!(signature && verifyCreemSignature(rawBody, signature))) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid signature",
      },
      {
        status: 400,
      }
    );
  }

  const { object, eventType } = JSON.parse(rawBody) as WebhookResponse;

  const user = await db.user.findUnique({
    where: {
      id: object.metadata.userId,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "User not found",
      },
      {
        status: 404,
      }
    );
  }

  try {
    switch (eventType) {
      case "checkout.completed":
        await db.user.update({
          where: {
            id: object.metadata.userId,
          },
          data: {
            customerId: object.customer.id,
            subscriptionId: object.subscription.id,
            currentPeriodEnd: new Date(
              object.subscription.current_period_end_date
            ),
          },
        });
        break;

      case "subscription.active":
        await db.user.update({
          where: {
            id: object.metadata.userId,
          },
          data: {
            customerId: object.customer.id,
            subscriptionId: object.id,
          },
        });
        break;

      case "subscription.paid":
        await db.user.update({
          where: {
            id: object.metadata.userId,
          },
          data: {
            customerId: object.customer.id,
            subscriptionId: object.id,
            currentPeriodEnd: new Date(object.current_period_end_date),
          },
        });
        break;

      case "subscription.trialing":
      case "subscription.update":
      case "subscription.paused":
        await db.user.update({
          where: {
            id: object.metadata.userId,
          },
          data: {
            customerId: object.customer.id,
            subscriptionId: object.id,
            currentPeriodEnd: new Date(object.current_period_end_date),
          },
        });
        break;

      case "refund.created":
      case "dispute.created":
        await db.user.update({
          where: {
            id: object.metadata.userId,
          },
          data: {
            customerId: object.customer.id,
            subscriptionId: object.subscription.id,
            currentPeriodEnd: new Date(
              object.subscription.current_period_end_date
            ),
          },
        });
    }
  } catch (error) {
    console.error(`❌ Error handling ${eventType}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal error during event handling",
        error: String(error),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Webhook received successfully",
  });
}
