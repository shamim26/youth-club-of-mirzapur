import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background text-foreground">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-6xl font-black mb-4 tracking-tighter bg-linear-to-br from-primary to-accent bg-clip-text text-transparent">
        404
      </h1>
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
        We couldn&apos;t find the page you&apos;re looking for. It might have
        been moved or doesn&apos;t exist.
      </p>
      <Link href="/">
        <Button
          size="lg"
          className="rounded-full shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 transition-all"
        >
          Return to Home
        </Button>
      </Link>
    </div>
  );
}
