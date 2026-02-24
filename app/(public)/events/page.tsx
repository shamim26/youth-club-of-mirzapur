import { createClient } from "@/utils/supabase/server";
import { YouthEvent } from "@/types/events";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover upcoming and past community events hosted by the Youth Club of Mirzapur. Join us to make lasting memories.",
  openGraph: {
    title: "Events | Youth Club of Mirzapur",
    description:
      "Discover upcoming and past community events hosted by the Youth Club of Mirzapur. Join us to make lasting memories.",
    url: "/events",
  },
};

export function EventCard({ event }: { event: YouthEvent }) {
  const dateObj = event.event_date ? new Date(event.event_date) : null;

  // Extract custom fields if any to display a category/type label
  const dynamicData = event.dynamic_data as Record<string, string> | null;
  const category =
    dynamicData?.Category || dynamicData?.Type || "Community Event";

  return (
    <div className="relative group overflow-hidden rounded-3xl bg-card border border-border/50 shadow-md transition-shadow hover:shadow-xl">
      <div className="flex flex-col lg:flex-row">
        {/* Image/Date Section */}
        <div className="relative lg:w-2/5 min-h-[300px] lg:min-h-auto bg-muted">
          {/* Image Placeholder Background */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/90 to-primary/40 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              {dateObj ? (
                <div className="bg-background/95 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg transform group-hover:-translate-y-1 transition-transform inline-block self-start">
                  <span className="block text-primary font-bold text-sm uppercase tracking-wider">
                    {format(dateObj, "MMM")}
                  </span>
                  <span className="block text-foreground font-black text-3xl">
                    {format(dateObj, "dd")}
                  </span>
                </div>
              ) : (
                <div className="bg-background/95 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg transform group-hover:-translate-y-1 transition-transform inline-block self-start">
                  <span className="block text-primary font-bold text-sm uppercase tracking-wider">
                    TBD
                  </span>
                </div>
              )}
              {event.is_published && (
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
                  Upcoming
                </span>
              )}
            </div>
            <div className="mt-auto">
              <h4 className="text-white/80 font-medium text-sm tracking-wider uppercase mb-2">
                {category}
              </h4>
            </div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-card">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {event.description && (
            <p className="text-muted-foreground mb-6 line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="space-y-4 mb-10">
            {dateObj && (
              <div className="flex items-center text-muted-foreground">
                <Clock className="w-5 h-5 mr-3 text-primary/70" />
                <span>{format(dateObj, "p")}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-5 h-5 mr-3 text-primary/70" />
                <span>{event.location}</span>
              </div>
            )}
            {dateObj && (
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-5 h-5 mr-3 text-primary/70" />
                <span>{format(dateObj, "EEEE, MMMM do, yyyy")}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 shadow-md w-fit"
            >
              <Link href={`/events/${event.id}`}>View Event Details</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function PublicEventsPage() {
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

  // For past events, we reverse the order so the most recent past event is at the top
  const pastEvents = (events || [])
    .filter((e) => (e.event_date ? new Date(e.event_date) < now : false))
    .sort(
      (a, b) =>
        new Date(b.event_date!).getTime() - new Date(a.event_date!).getTime(),
    );

  return (
    <div className="container max-w-6xl mx-auto py-20 px-6 md:px-0 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary mb-4">
            Events
          </h1>
          <p className="text-lg text-muted-foreground">
            Join us in our upcoming community events. Check details, participate
            in polls, and register to secure your spot. Explore our past events
            to see the memories we&apos;ve made.
          </p>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
            {upcomingEvents.length}
          </span>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-3xl border border-dashed">
            <Calendar className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-medium">No Upcoming Events</h3>
            <p className="text-muted-foreground mt-1">
              Check back later for new events.
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {upcomingEvents.map((event: YouthEvent) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <section className="space-y-8 pt-8">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-muted-foreground">
              Past Events
            </h2>
            <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-semibold">
              {pastEvents.length}
            </span>
          </div>

          <div className="grid gap-8 opacity-80 hover:opacity-100 transition-opacity">
            {pastEvents.map((event: YouthEvent) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
