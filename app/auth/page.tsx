"use client";

import { User } from "lucide-react";

import Image from "next/image";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormField,
  FormControl,
  FormError,
  FormLabel,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OverlayLoader from "@/components/ui/overlay-loader";

const errorMessages: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already in use. Sign in with the provider you used originally, or link that account first.",
  Callback: "Error during sign-in. Please try again.",
  EmailSignin: "Error sending magic link. Try again.",
  Default: "Unable to sign in.",
};

const formSchema = z.object({
  email: z.email("Please enter a valid email!"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const [magicLinkEmail, setMagicLinkEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useSearchParams();
  const router = useRouter();

  const { status } = useSession();

  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const error = params.get("error") || null;

  useEffect(() => {
    if (status === "authenticated") router.replace(callbackUrl);
    if (error)
      toast.error("An error occured", {
        description: errorMessages[error] ?? "Something went horribly wrong!",
      });
  }, [callbackUrl, error, router, status]);

  const form = useForm<FormValues>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const result = await signIn("email", {
        redirect: false,
        callbackUrl: callbackUrl,
        email: values.email,
      });

      if (result?.error) {
        toast.error("Unable to authenticate!", {
          description: String(result.error),
        });
      } else {
        setMagicLinkEmail(values.email);
        toast.success("Magic link sent", {
          description: `Check ${values.email} for the sign-in link.`,
        });
      }
    } catch (error) {
      console.error("signIn error:", error);
      toast.error("Something went wrong!", {
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkEmail)
    return (
      <div className="h-screen grid place-items-center bg-background p-4">
        <div className="container-md flex flex-col shadow-2xl p-6 rounded-lg bg-white text-center">
          <h2>Check your email</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a magic sign-in link to <strong>{magicLinkEmail}</strong>.
          </p>
          <p className="mt-4 text-sm">
            Didn&apos;t receive it? Check your spam folder or try again.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button onClick={() => setMagicLinkEmail(null)}>Try again</Button>
            <Button
              variant="primary"
              onClick={() => router.push("/")}
            >
              Back to home
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="h-screen grid place-items-center bg-background">
      <div className="container-md flex flex-col shadow-2xl p-6 rounded-lg bg-white">
        <OverlayLoader isLoading={isLoading} />
        <h2>Welcome Back!</h2>
        <p className="text-muted-foreground my-2">Log in to your account</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-3"
          >
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
            >
              <User />
              {isLoading ? "Processing..." : "Continue"}
            </Button>
          </form>
        </Form>
        <div className="relative h-0.25 w-full bg-muted-foreground my-5">
          <span className="text-xs text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1">
            OR
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <Button variant="default">
            <Image
              src="/providers/google.webp"
              alt="Google Logo"
              className="size-5"
              width={120}
              height={120}
            />
            Continue with Google
          </Button>
          <Button
            variant="default"
            onClick={() => signIn("github", { callbackUrl })}
          >
            <Image
              src="/providers/github.webp"
              alt="GitHub Logo"
              className="size-5"
              width={120}
              height={120}
            />
            Continue with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
