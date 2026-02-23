"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateProfile(data: {
  full_name: string;
  phone_number: string;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        phone_number:
          data.phone_number.trim() === "" ? null : data.phone_number.trim(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);

      // Handle Postgres unique constraint violation
      // "23505" is the unique_violation error code
      if (
        error.code === "23505" &&
        error.message.includes("profiles_phone_number_key")
      ) {
        return {
          success: false,
          error: "This phone number is already registered to another user.",
        };
      }

      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

export async function getApprovedMembers() {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, members: null, error: "Not authenticated" };
    }

    // Verify current user is actually approved before showing the directory
    const { data: currentUserProfile, error: profileError } = await supabase
      .from("profiles")
      .select("is_approved, is_deleted, is_banned")
      .eq("id", user.id)
      .single();

    if (
      profileError ||
      !currentUserProfile?.is_approved ||
      currentUserProfile?.is_deleted ||
      currentUserProfile?.is_banned
    ) {
      return {
        success: false,
        members: null,
        error: "You must be an approved member to view the club directory.",
      };
    }

    // Fetch all other approved, active members
    const { data: members, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone_number, is_approved")
      .eq("is_approved", true)
      .eq("is_deleted", false)
      .eq("is_banned", false)
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Error fetching directory:", error);
      return { success: false, members: null, error: error.message };
    }

    return { success: true, members, error: null };
  } catch (err: unknown) {
    return {
      success: false,
      members: null,
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}
