"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  FormSubmitError,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const errorMessages: Record<string, string> = {
  Configuration: "There was a problem with the server.",
  AccessDenied: "Access denied.",
  Verification: "Verification failed! Please try again.",
  OAuthAccountNotLinked:
    "This email is already in use. Sign in with the provider you used originally.",
  Callback: "Error during sign-in. Please try again.",
  EmailSignin: "Error sending magic link. Try again.",
  Signin: "Something went wrong!",
  OAuthSignIn: "Could not sign in with provider.",
  OAuthCallbackError: "Login failed during provider callback.",
  OAuthCreateAccount: "Could not create account with provider.",
  EmailCreateAccount: "Could not create account with email.",
  SessionRequired: "Please sign in to continue.",
  Default: "Something went wrong!",
};

const formSchema = z.object({
  email: z.email("Please enter a valid email!"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Auth() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useSearchParams();

  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const email = params.get("email") ?? "";
  const errorCode = params.get("error");

  useEffect(() => {
    if (errorCode) {
      setError(errorMessages[errorCode] ?? "Something went horribly wrong!");
    }
  }, [errorCode]);

  const form = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
    },
  });

  const handleProvider = async (provider: "google" | "github") => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn(provider, {
        redirectTo: callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError("Unable to authenticate right now! Try again later.");
      } else {
        router.replace(callbackUrl);
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async ({ email }: FormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("nodemailer", {
        redirectTo: callbackUrl,
        redirect: false,
        email,
      });

      if (result?.error) {
        setError("Unable to authenticate right now! Try again later.");
      } else {
        router.push(`/check-email?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error("signIn error:", error);
      setError("Something went wrong! Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen place-items-center bg-linear-110 from-accent/25 via-background to-primary/25">
      <div className="container-md flex max-w-[400px] flex-col rounded-lg bg-secondary p-6 text-center shadow-2xl">
        <h2 className="text-4xl">Welcome!</h2>
        <p className="text-center text-muted-foreground">
          Create an account or login to continue!
        </p>
        <Form {...form}>
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(handleSubmit)();
            }}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="email"
                      placeholder="Email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormError />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              disabled={isLoading}
              type="submit"
              variant="primary"
            >
              <Mail className="size-4.5" />
              {isLoading ? "Processing..." : "Continue with Email"}
            </Button>
            <FormSubmitError error={error} />
          </form>
        </Form>
        <div className="relative my-5 h-0.25 w-full bg-muted-foreground">
          <span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 bg-secondary p-1 text-muted-foreground text-xs">
            OR
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            className="relative"
            disabled={isLoading}
            onClick={async () => handleProvider("google")}
            variant="muted"
          >
            <Image
              alt="Google Logo"
              className="size-5"
              height={120}
              src="/providers/google.webp"
              width={120}
            />
            Continue with Google
            <Badge
              className="-right-2 -translate-y-1/2 absolute top-0 text-[10px] md:text-xs bevel"
              variant="gradient"
            >
              Recommended
            </Badge>
          </Button>
          <Button
            disabled={isLoading}
            onClick={async () => handleProvider("github")}
            variant="muted"
          >
            <Image
              alt="GitHub Logo"
              className="size-5"
              height={120}
              src="/providers/github.webp"
              width={120}
            />
            Continue with GitHub
          </Button>
        </div>
        <p className="mt-6 text-center text-muted-foreground text-xs">
          By continuing, you agree to our{" "}
          <Link
            href="/terms-of-service"
            rel="noopener noreferrer"
            target="_blank"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
