"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { signUpWithEmail } from "@/app/auth/actions";
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

// Schema for registration validation
const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().optional(),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    setError(null);

    // Call the server action to sign up
    const result = await signUpWithEmail(data);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Successful registration, redirect to verify email
      router.push("/verify-email");
      router.refresh();
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto border-border/50 shadow-2xl bg-card md:mt-16">
      <CardHeader className="space-y-3 text-center">
        <div className="flex justify-center mb-2">
          <Logo />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Join the Club
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Create an account to RSVP for events and access the treasury.
        </CardDescription>

        {error && (
          <div className="p-3 mt-4 text-sm font-medium text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <GoogleAuthButton mode="register" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-medium pr-4">
              Or sign up with email/phone
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. John Doe"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold">
                    Phone Number*
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+880 1..."
                      className="h-12 bg-background border-border focus-visible:ring-primary focus-visible:ring-offset-background"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Required for club WhatsApp group verification.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold">
                    Email (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      className="h-12 bg-background border-border focus-visible:ring-primary focus-visible:ring-offset-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      Password
                    </FormLabel>
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      Confirm Password
                    </FormLabel>
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
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-4 text-base font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
              size="lg"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pb-8">
        <div className="text-center text-sm text-muted-foreground mt-2">
          Already a member?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-accent transition-colors"
          >
            Sign In Here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
