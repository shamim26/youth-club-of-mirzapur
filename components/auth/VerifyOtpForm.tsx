"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { verifyOtpAction, resendOtpAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

const otpSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function VerifyOtpForm({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function handleResend() {
    setIsResending(true);
    setError(null);
    setResendMessage(null);

    const result = await resendOtpAction(email);

    if (result.error) {
      setError(result.error);
    } else {
      setResendMessage("Verification code resent successfully!");
      setResendTimer(60); // Reset timer
    }
    setIsResending(false);
  }

  async function onSubmit(data: z.infer<typeof otpSchema>) {
    setIsLoading(true);
    setError(null);
    setResendMessage(null);

    const result = await verifyOtpAction(email, data.pin);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {

      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6 flex flex-col items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col items-center"
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
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

          {error && (
            <div className="p-3 w-full text-sm font-medium text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

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
            {isLoading ? "Verifying..." : "Verify & Continue"}
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
    </div>
  );
}
