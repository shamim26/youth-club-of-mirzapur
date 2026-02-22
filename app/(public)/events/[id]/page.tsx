import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, MapPin, AlignLeft } from "lucide-react";
import RsvpComponent from "./components/RsvpComponent";
import GalleryComponent from "./components/GalleryComponent";
import CommentsComponent from "./components/CommentsComponent";
import PollsComponent from "./components/PollsComponent";
import AttendeesListComponent from "./components/AttendeesListComponent";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = await createClient();

  // 1. Fetch User Session & Profile
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isApproved = false;
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_approved, is_banned")
      .eq("id", user.id)
      .single();
    if (profile) {
      isAdmin = profile.role === "admin" || profile.role === "super_admin";
      // If banned, totally revoke approval (acts functionally like an unapproved user for interactions)
      isApproved = !profile.is_banned && (profile.is_approved || isAdmin);
    }
  }

  // 2. Fetch Event
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event || (!event.is_published && !isAdmin)) {
    return notFound();
  }

  // 3. Fetch Event Details (RSVPs, Polls, Photos, Comments) concurrently for speed
  const [
    { data: rsvps },
    { data: pollsData },
    { data: photos },
    { data: comments },
  ] = await Promise.all([
    supabase
      .from("event_rsvps")
      .select("*, profiles(full_name)")
      .eq("event_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("event_polls")
      .select(
        `
      id, event_id, question, created_at,
      options:event_poll_options(id, poll_id, text, created_at),
      votes:event_poll_votes(id, poll_id, option_id, user_id, profiles:user_id(full_name))
    `,
      )
      .eq("event_id", id),
    supabase
      .from("event_photos")
      .select("*, profiles:uploaded_by(full_name)")
      .eq("event_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("event_comments")
      .select(
        `
      id, event_id, user_id, text, created_at, updated_at,
      profiles:user_id(full_name)
      `,
      )
      .eq("event_id", id)
      .order("created_at", { ascending: true }),
  ]);

  // Transform polls to fit our component expectations
  const polls =
    pollsData?.map((pollData: unknown) => {
      const poll = pollData as {
        id: string;
        event_id: string;
        question: string;
        options: { id: string; poll_id: string; text: string }[];
        votes: {
          id: string;
          poll_id: string;
          option_id: string;
          user_id: string;
          profiles?: { full_name?: string };
        }[];
      };

      const optionsWithCounts = poll.options.map((opt) => {
        const optionVotes = poll.votes
          ? poll.votes.filter((v) => v.option_id === opt.id)
          : [];
        const voters = optionVotes.map(
          (v) => v.profiles?.full_name || "Unknown",
        );
        return { ...opt, votes_count: optionVotes.length, voters };
      });

      const userVote =
        user && poll.votes
          ? poll.votes.find((v) => v.user_id === user.id)?.option_id
          : null;

      return {
        ...poll,
        event_poll_options: optionsWithCounts,
        userVote,
      };
    }) || [];

  const currentUserRsvp =
    user && rsvps
      ? rsvps.find(
          (r: { user_id: string; status: string }) => r.user_id === user.id,
        )?.status
      : null;
  const attendingCount = rsvps
    ? rsvps.filter((r: { status: string }) => r.status === "attending").length
    : 0;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-20 space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="space-y-6 pb-8 border-b pt-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
          {event.title}
        </h1>

        <div className="flex flex-wrap gap-6 text-muted-foreground pt-2">
          {event.event_date && (
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-md">
              <Calendar className="h-5 w-5 text-primary/70" />
              <span className="font-medium">
                {format(new Date(event.event_date), "PPP 'at' p")}
              </span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-md">
              <MapPin className="h-5 w-5 text-primary/70" />
              <span className="font-medium">{event.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        {/* Left Column: Details, Gallery, Comments */}
        <div className="contents lg:flex lg:flex-col lg:w-2/3 lg:gap-5">
          {/* 2. Description & Dynamic Data */}
          <section className="order-1 bg-card rounded-xl border p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <AlignLeft className="h-6 w-6 text-primary" />
              Event Details
            </h2>
            {event.description && (
              <div className="prose dark:prose-invert max-w-none text-muted-foreground mb-6">
                <p>{event.description}</p>
              </div>
            )}

            {event.dynamic_data &&
              Object.keys(event.dynamic_data).length > 0 && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Additional Information
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                    {Object.entries(event.dynamic_data).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-muted/10 p-4 rounded-lg border"
                      >
                        <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          {key}
                        </dt>
                        <dd className="text-base font-medium">
                          {String(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
          </section>

          {/* 3. Photo Gallery */}
          <section className="order-2">
            <GalleryComponent
              eventId={event.id}
              eventTitle={event.title}
              photos={photos || []}
              isAdmin={isAdmin}
              isApproved={isApproved}
            />
          </section>

          {/* 7. Comments Section (at last on mobile, follows gallery on desktop) */}
          <section className="order-6">
            <CommentsComponent
              eventId={event.id}
              comments={
                (comments as unknown as React.ComponentProps<
                  typeof CommentsComponent
                >["comments"]) || []
              }
              isApproved={isApproved}
              isAdmin={isAdmin}
              currentUserId={user?.id}
            />
          </section>
        </div>

        {/* Right Column: RSVP, Attendees, Polls */}
        <div className="contents lg:flex lg:flex-col lg:w-1/3 lg:gap-6">
          {/* 4. Registration (RSVP) */}
          <div className="order-3">
            <RsvpComponent
              eventId={event.id}
              isApproved={isApproved}
              currentRsvpStatus={currentUserRsvp}
              attendingCount={attendingCount}
            />
          </div>

          {/* 5. Attendees List */}
          <div className="order-4">
            <AttendeesListComponent
              attendees={rsvps || []}
              eventId={id}
              isAdmin={isAdmin}
              currentUserId={user?.id || null}
            />
          </div>

          {/* 6. Polls */}
          {polls.length > 0 && (
            <div className="order-5">
              <PollsComponent
                eventId={event.id}
                polls={polls}
                isApproved={isApproved}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
