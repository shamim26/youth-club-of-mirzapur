import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
