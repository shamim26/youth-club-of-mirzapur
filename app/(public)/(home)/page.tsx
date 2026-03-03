import { Hero } from "@/components/home/Hero";
import { CoreFeatures } from "@/components/home/CoreFeatures";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";

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
