import { Hero } from "@/components/home/Hero";
import { CoreFeatures } from "@/components/home/CoreFeatures";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to the Youth Club of Mirzapur. Experience community events, view our gallery, and become an active member.",
  openGraph: {
    title: "Home | Youth Club of Mirzapur",
    description:
      "Welcome to the Youth Club of Mirzapur. Experience community events, view our gallery, and become an active member.",
    url: "/",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full">
        <Hero />
        <CoreFeatures />
        <UpcomingEvents />
      </main>
    </div>
  );
}
