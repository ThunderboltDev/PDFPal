"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendGTMEvent } from "@next/third-parties/google";
import { Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormError,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import config from "@/config";

if (!process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY) {
  throw new Error("env variable NEXT_PUBLIC_HCAPTCHA_SITE_KEY not found");
}

const hcaptchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

const contactFormSchema = z.object({
  email: z.email("Invalid email"),
  name: z
    .string("Username is required")
    .min(3, "Username is too short")
    .max(50, "Username is too long"),
  message: z
    .string("Message cannot be empty")
    .min(10, "Message is too short")
    .max(1000, "Message is too long"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactProps {
  session: Session | null;
}

export default function ContactPage({ session }: ContactProps) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const router = useRouter();

  const { mutateAsync: sendMessage, isPending } =
    trpc.contact.sendMessage.useMutation({
      onSuccess: () => {
        sendGTMEvent({
          event: "contact-form-submitted",
          value: 1,
          user_id: session?.userId,
        });
        captchaRef.current?.resetCaptcha();
        toast.success("Message sent successfully!");
        router.replace("/contact/success");
      },
      onError: () => {
        sendGTMEvent({
          event: "contact-form-submission-failed",
          value: 1,
          user_id: session?.userId,
        });
        toast.error("Something went wrong! Please try again later!");
      },
    });

  const form = useForm<ContactFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: session?.user?.name ? session.user.name : "",
      email: session?.user?.email ? session.user.email : "",
    },
  });

  const handleSubmit = async (values: ContactFormValues) => {
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA");
      captchaRef.current?.execute();
      return;
    }

    try {
      await sendMessage({
        ...values,
        captchaToken,
        userId: session?.userId ?? null,
      });
    } catch (error) {
      console.error("Error while sending message: ", error);
      toast.error("Something went horribly wrong! Please try again later!");
    }
  };

  return (
    <main className="container-xl mt-20">
      <section>
        <h2>Contact Us</h2>
        <p>
          Have questions or need support? We&apos;d love to hear from you. Email{" "}
          us at{" "}
          <Link href={`mailto:${config.socials.email}`}>
            {config.socials.email}
          </Link>{" "}
          or reach out using the form below.
        </p>
        <p>
          Also check out the <Link href="/faq">FAQ</Link> page to find answers
          to commonly asked questions quickly. You can also reach us on{" "}
          <Link href={config.socials.discord}>Discord</Link>.
        </p>
      </section>

      <Form {...form}>
        <form
          className="mt-6 space-y-3"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex w-full flex-col gap-3 md:flex-row md:gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Username"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormError />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="email"
                      disabled={isPending}
                      placeholder="Email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormError />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isPending}
                    placeholder="Write a short message"
                    {...field}
                  />
                </FormControl>
                <FormError />
              </FormItem>
            )}
          />
          <HCaptcha
            onError={() => {
              toast.error("CAPTCHA error, please try again.");
            }}
            onExpire={() => {
              setCaptchaToken(null);
            }}
            onVerify={(token) => {
              setCaptchaToken(token);
            }}
            ref={captchaRef}
            sitekey={
              process.env.NEXT_PUBLIC_ENV === "development"
                ? "10000000-ffff-ffff-ffff-000000000001"
                : hcaptchaSiteKey
            }
            size="invisible"
          />
          <Button
            className="mt-2 w-full"
            disabled={isPending}
            type="submit"
            variant="primary"
          >
            <Send />
            Send Message
          </Button>
        </form>
      </Form>
    </main>
  );
}
