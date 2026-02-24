import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch their profile to check their role and approval status
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_approved")
    .eq("id", user?.id)
    .single();

  const role = profile?.role || "member";
  const isApproved = profile?.is_approved;

  return (
    <>
      <Navbar user={user} role={role} isApproved={isApproved} />
      {children}
      <Footer />
    </>
  );
}
