import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { EventCard } from "@/app/(public)/events/page";

export async function UpcomingEvents() {
  const supabase = await createClient();

  // Fetch only published events
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("event_date", { ascending: true });

  if (error) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold tracking-tight text-destructive">
          Error loading events
        </h1>
        <p className="mt-2 text-muted-foreground animate-pulse">
          We&apos;re unable to fetch the events right now. Please try again
          later.
        </p>
      </div>
    );
  }

  const now = new Date();

  // Separate into upcoming and past
  const upcomingEvents = (events || []).filter((e) =>
    e.event_date ? new Date(e.event_date) >= now : true,
  );

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Next Gathering
            </h2>
            <div className="h-1.5 w-20 bg-primary rounded-full mb-4" />
            <p className="text-muted-foreground">
              Don&apos;t miss our upcoming community events. Register early to
              help us with logistics and catering!
            </p>
          </div>
          <Link href="/events" className="hidden md:block">
            <Button variant="outline" className="rounded-full">
              View All Events
            </Button>
          </Link>
        </div>

        {/* Featured Event Card */}
        {upcomingEvents.length > 0 ? (
          <EventCard event={upcomingEvents[0]} />
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No upcoming events</p>
          </div>
        )}

        <Link href="/events" className="mt-8 md:hidden flex justify-center">
          <Button variant="outline" className="rounded-full w-full">
            View All Events
          </Button>
        </Link>
      </div>
    </section>
  );
}
