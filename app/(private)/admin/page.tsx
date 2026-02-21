import { createClient } from "@/utils/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Basic sanity check to fetch profiles count to display as a quick stat.
  const { count: usersCount, error: usersError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: activeUsers, error: activeError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("is_banned", false);

  if (usersError || activeError) {
    console.error("Dashboard Page Error:", usersError || activeError);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground text-sm flex items-center gap-2">
          <span>Real-time snapshot</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground tracking-wide">
              Total Members
            </h3>
            <div className="text-4xl font-black text-foreground">
              {usersCount ?? "0"}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Registered users in the club.
            </p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground tracking-wide">
              Active Members
            </h3>
            <div className="text-4xl font-black text-foreground">
              {activeUsers ?? "0"}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Users currently in good standing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
