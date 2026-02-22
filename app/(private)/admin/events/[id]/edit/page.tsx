import { createClient } from "@/utils/supabase/server";
import { verifyAdminAccess } from "../../../users/actions";
import { notFound, redirect } from "next/navigation";
import EventForm from "../../EventForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const supabase = await createClient();

  try {
    await verifyAdminAccess(supabase, "admin");
  } catch {
    redirect("/dashboard");
  }

  const { data: event, error } = await supabase
    .from("events")
    .select(
      `
      *,
      polls:event_polls(id, question, options:event_poll_options(id, text))
    `,
    )
    .eq("id", id)
    .single();

  if (error || !event) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/events">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground">
            Update event details and custom fields. To manage polls and gallery,
            go to the public event page.
          </p>
        </div>
      </div>

      <EventForm event={event} />
    </div>
  );
}
