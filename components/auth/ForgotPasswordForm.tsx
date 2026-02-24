"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

import {
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  updatePassword,
} from "@/app/auth/actions";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import Logo from "../Logo";
import Link from "next/link";
import { toast } from "sonner";

// Define schemas for each step
const emailSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

const otpSchema = z.object({
  pin: z.string().min(6, "Your one-time password must be 6 characters."),
});

const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for the password step
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timer for OTP resend
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, resendTimer]);

  // Forms
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { pin: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Handlers
  async function onEmailSubmit(data: z.infer<typeof emailSchema>) {
    setIsLoading(true);
    setError(null);
    const result = await sendPasswordResetOtp(data.email);

    if (result.error) {
      setError(result.error);
    } else {
      setEmail(data.email);
      setStep("otp");
      setResendTimer(60);
      toast.success("Verification code sent to your email.");
    }
    setIsLoading(false);
  }

  async function handleResend() {
    setIsResending(true);
    setError(null);
    setResendMessage(null);

    const result = await sendPasswordResetOtp(email);

    if (result.error) {
      setError(result.error);
    } else {
      setResendMessage("Verification code resent successfully!");
      setResendTimer(60);
    }
    setIsResending(false);
  }

  async function onOtpSubmit(data: z.infer<typeof otpSchema>) {
    setIsLoading(true);
    setError(null);

    const result = await verifyPasswordResetOtp(email, data.pin);

    if (result.error) {
      setError(result.error);
    } else {
      setStep("password");
      toast.success("Code verified. Please enter a new password.");
    }
    setIsLoading(false);
  }

  async function onPasswordSubmit(data: z.infer<typeof passwordSchema>) {
    setIsLoading(true);
    setError(null);

    const result = await updatePassword(data.password);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      toast.success("Password updated successfully! Welcome back.");
      router.push("/");
      router.refresh();
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 shadow-2xl bg-card md:mt-16">
      <CardHeader className="space-y-3 text-center">
        <div className="flex justify-center mb-2">
          <Logo />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          {step === "email" && "Reset your password"}
          {step === "otp" && "Check your email"}
          {step === "password" && "Set a new password"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {step === "email" &&
            "Enter your email address and we'll send you a verification code."}
          {step === "otp" &&
            `We've sent a 6-digit verification code to ${email}.`}
          {step === "password" &&
            "Your password must be at least 6 characters."}
        </CardDescription>

        {error && (
          <div className="p-3 mt-4 text-sm font-medium text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* STEP 1: EMAIL */}
        {step === "email" && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="h-12 bg-background border-border focus-visible:ring-primary focus-visible:ring-offset-background"
                        disabled={isLoading}
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
                {isLoading ? "Sending code..." : "Send Verification Code"}
              </Button>
            </form>
          </Form>
        )}

        {/* STEP 2: OTP */}
        {step === "otp" && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOtpSubmit)}
              className="space-y-6 flex flex-col items-center"
            >
              <FormField
                control={otpForm.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <InputOTP maxLength={6} disabled={isLoading} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="w-12 h-14 text-xl font-bold bg-background border-border focus:ring-primary focus:border-primary"
                          />
                          <InputOTPSlot
                            index={1}
                            className="w-12 h-14 text-xl font-bold bg-background border-border focus:ring-primary focus:border-primary"
                          />
                          <InputOTPSlot
                            index={2}
                            className="w-12 h-14 text-xl font-bold bg-background border-border focus:ring-primary focus:border-primary"
                          />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={3}
                            className="w-12 h-14 text-xl font-bold bg-background border-border focus:ring-primary focus:border-primary"
                          />
                          <InputOTPSlot
                            index={4}
                            className="w-12 h-14 text-xl font-bold bg-background border-border focus:ring-primary focus:border-primary"
                          />
                          <InputOTPSlot
                            index={5}
                            className="w-12 h-14 text-xl font-bold bg-background border-border focus:ring-primary focus:border-primary"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {resendMessage && (
                <div className="p-3 w-full text-sm font-medium text-green-700 bg-green-100 border border-green-200 rounded-md dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                  {resendMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
                size="lg"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={resendTimer > 0 || isResending}
                className="w-full mt-2"
              >
                {isResending
                  ? "Resending..."
                  : resendTimer > 0
                    ? `Resend Code in ${resendTimer}s`
                    : "Didn't receive code? Resend"}
              </Button>
            </form>
          </Form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === "password" && (
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-12 bg-background border-border focus-visible:ring-primary focus-visible:ring-offset-background pr-10"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-12 w-12 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                          <span className="sr-only">
                            Toggle password visibility
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-12 bg-background border-border focus-visible:ring-primary focus-visible:ring-offset-background pr-10"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-12 w-12 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                          <span className="sr-only">
                            Toggle confirm password visibility
                          </span>
                        </Button>
                      </div>
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
                {isLoading ? "Saving..." : "Change Password"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pb-8 border-t border-border/50 pt-4 mt-6">
        <div className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-accent hover:underline transition-colors"
          >
            Sign In Here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
