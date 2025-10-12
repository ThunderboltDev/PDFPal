"use client";

import { Mail } from "lucide-react";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormControl,
  FormError,
  FormLabel,
  FormItem,
  FormSubmitError,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      email: email,
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
      const result = await signIn("email", {
        redirectTo: callbackUrl,
        redirect: false,
        email: email,
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
    <div className="h-screen grid place-items-center bg-linear-110 from-accent/25 via-background to-primary/25">
      <div className="container-md max-w-[400px] text-center flex flex-col shadow-2xl p-6 rounded-lg bg-secondary">
        <h2 className="text-4xl">Welcome!</h2>
        <p className="text-muted-foreground text-center">
          Create an account or login to continue!
        </p>
        <Form {...form}>
          <form
            className="space-y-3 mt-4"
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
              disabled={isLoading}
            >
              <Mail className="size-4.5" />
              {isLoading ? "Processing..." : "Continue with Email"}
            </Button>
            <FormSubmitError error={error} />
          </form>
        </Form>
        <div className="relative h-0.25 w-full bg-muted-foreground my-5">
          <span className="text-xs text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary p-1">
            OR
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            variant="muted"
            className="relative"
            onClick={async () => handleProvider("google")}
            disabled={isLoading}
          >
            <Image
              src="/providers/google.webp"
              alt="Google Logo"
              className="size-5"
              height={120}
              width={120}
            />
            Continue with Google
            <Badge
              variant="gradient"
              className="absolute top-0 -right-2 -translate-y-1/2 text-xs"
            >
              Recommended
            </Badge>
          </Button>
          <Button
            variant="muted"
            onClick={async () => handleProvider("github")}
            disabled={isLoading}
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
        <p className="text-xs text-muted-foreground mt-6 text-center">
          By continuing, you agree to our{" "}
          <Link
            href="/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
