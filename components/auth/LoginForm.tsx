"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { signInWithEmail } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleAuthButton } from "./GoogleAuthButton";
import Logo from "../Logo";

// Schema for login validation
const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    // Call the server action to log in
    const result = await signInWithEmail(data);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Successful login, redirect to home/dashboard
      router.push("/");
      router.refresh(); // Ensure the layout picks up the new auth state
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 shadow-2xl bg-card md:mt-16">
      <CardHeader className="space-y-3 text-center">
        <div className="flex justify-center mb-2">
          <Logo />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Welcome Back, Brother
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to your Youth Club of Mirzapur account.
        </CardDescription>

        {error && (
          <div className="p-3 mt-4 text-sm font-medium text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <GoogleAuthButton mode="login" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-medium pr-4">
              Or continue with email/phone
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold">
                    Email or Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email or phone..."
                      className="h-12 bg-background border-border focus-visible:ring-primary focus-visible:ring-offset-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-foreground font-semibold">
                      Password
                    </FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline hover:text-accent transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 bg-background border-border focus-visible:ring-primary focus-visible:ring-offset-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-4 text-base font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
              size="lg"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pb-8">
        <div className="text-center text-sm text-muted-foreground mt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-accent hover:underline transition-colors"
          >
            Join the Club
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
