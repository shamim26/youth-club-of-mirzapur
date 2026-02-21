import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 py-24 sm:p-8 bg-background relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Form Container */}
      <div className="relative z-10 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card className="w-full max-w-md mx-auto border-border/50 shadow-2xl bg-card md:mt-16 text-center">
          <CardHeader className="space-y-3">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Check your email
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-2">
              We&apos;ve sent a verification link to your email address. Please
              click the link to verify your account and to log in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <p className="text-sm text-muted-foreground px-4">
              Don&apos;t see it? Check your spam folder or Promotions tab, just
              in case.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8">
            <Link href="/login" className="w-full">
              <Button
                className="w-full h-12 text-base font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
                size="lg"
              >
                Back to Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
