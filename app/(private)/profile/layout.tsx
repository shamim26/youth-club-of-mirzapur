import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch their profile to check their role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  const role = profile?.role || "member";

  return (
    <>
      <Navbar user={user} role={role} />
      {children}
      <Footer />
    </>
  );
}
