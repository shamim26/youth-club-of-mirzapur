import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { YouthEvent } from "@/types/events";
import { AccountsClient } from "./AccountsClient";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const supabase = await createClient();

  // Optional: check user role just to be safe
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "member";
  if (role !== "admin" && role !== "super_admin") {
    redirect("/profile");
  }

  // Fetch all published events
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Accounts & Ledger
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage income and expenses for specific events.
          </p>
        </div>
      </div>

      <AccountsClient initialEvents={(events as YouthEvent[]) || []} />
    </div>
  );
}
