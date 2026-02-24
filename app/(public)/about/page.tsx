import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about the mission, vision, and story of the Youth Club of Mirzapur.",
  openGraph: {
    title: "About Us | Youth Club of Mirzapur",
    description:
      "Learn more about the mission, vision, and story of the Youth Club of Mirzapur.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-4xl pt-32 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Info className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-4xl font-bold mb-4 tracking-tight">About Us</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-8">
        We are actively working on this page to share the story and mission of
        the Youth Club of Mirzapur. Please check back later!
      </p>
      <Link href="/">
        <Button
          size="lg"
          className="rounded-full shadow-sm shadow-primary/20 hover:-translate-y-0.5 transition-all"
        >
          Return Home
        </Button>
      </Link>
    </div>
  );
}
