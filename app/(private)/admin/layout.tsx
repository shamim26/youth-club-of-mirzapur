import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch their profile to check their role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "member";

  // If they are just a member, redirect them to the generic member profile
  if (role === "member") {
    redirect("/profile");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-muted/40 text-foreground">
      {/* Sidebar with the user's role metadata */}
      <Sidebar role={role} />

      <div className="flex-1 flex flex-col md:pl-64 overflow-hidden">
        {/* Main Admin Content */}
        <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
