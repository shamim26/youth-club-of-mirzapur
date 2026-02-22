import { createClient } from "@/utils/supabase/server";
import { verifyAdminAccess } from "../../users/actions";
import { redirect } from "next/navigation";
import EventForm from "../EventForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function CreateEventPage() {
  const supabase = await createClient();

  try {
    await verifyAdminAccess(supabase, "admin");
  } catch {
    redirect("/dashboard");
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
          <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
          <p className="text-muted-foreground">
            Add a new event with its details and dynamic features.
          </p>
        </div>
      </div>

      <EventForm />
    </div>
  );
}
