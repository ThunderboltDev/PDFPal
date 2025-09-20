"use client";

import { Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
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
  const { data: session } = useSession();

  const { mutateAsync: sendMessage, isPending } = trpc.sendMessage.useMutation({
    onError: () => toast.error("Something went wrong! Please try again later!"),
    onSuccess: () => {
      toast.success("Message sent successfully!");
    },
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
    try {
      await sendMessage(values);
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
