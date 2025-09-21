"use client";

import { Send } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import z from "zod";

import {
  Form,
  FormField,
  FormControl,
  FormError,
  FormLabel,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "../_trpc/client";
import config from "@/config";
import { useRouter } from "next/navigation";

const contactFormSchema = z.object({
  email: z.email("Invalid email"),
  name: z
    .string("Name cannot be empty")
    .min(3, "Name is too short")
    .max(50, "Name is too long"),
  message: z
    .string("Message cannot be empty")
    .min(10, "Message is too short")
    .max(250, "Message is too long"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const router = useRouter();

  const { data: session } = useSession();

  const { mutateAsync: sendMessage, isPending } =
    trpc.contact.sendMessage.useMutation({
      onSuccess: () => {
        captchaRef.current?.resetCaptcha();
        toast.success("Message sent successfully!");
        router.push("/contact/success");
      },
      onError: () =>
        toast.error("Something went wrong! Please try again later!"),
    });

  const form = useForm<ContactFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: session?.user.name ? session.user.name : "",
      email: session?.user.email ? session.user.email : "",
    },
  });

  const handleSubmit = async (values: ContactFormValues) => {
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA");
      captchaRef.current?.execute();
      return;
    }

    try {
      await sendMessage({ ...values, captchaToken });
    } catch (error) {
      console.error("Error while sending message: ", error);
      toast.error("Something went horribly wrong! Please try again later!");
    }
  };

  return (
    <div className="container-xl mt-20">
      <h2 className="mb-2">Contact Us</h2>
      <p>
        Have questions or need support? We&apos;d love to hear from you. Email{" "}
        us at{" "}
        <Link href={`mailto:${config.socials.email}`}>
          {config.socials.email}
        </Link>{" "}
        or reach out using the form below.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-3 mt-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Username"
                    disabled={!!session?.user.name || isPending}
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
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    readOnly={!!session?.user.email || isPending}
                    {...field}
                  />
                </FormControl>
                <FormError />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a short message"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormError />
              </FormItem>
            )}
          />
          <HCaptcha
            size="invisible"
            ref={captchaRef}
            sitekey={
              process.env.NEXT_PUBLIC_ENV === "development"
                ? "10000000-ffff-ffff-ffff-000000000001"
                : process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!
            }
            onVerify={(token) => {
              setCaptchaToken(token);
            }}
            onError={() => {
              toast.error("CAPTCHA error, please try again.");
            }}
            onExpire={() => {
              setCaptchaToken(null);
            }}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isPending}
          >
            <Send />
            Send Message
          </Button>
        </form>
      </Form>
    </div>
  );
}
