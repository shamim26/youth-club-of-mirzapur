"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Type definition for valid roles
export type UserRole = "super_admin" | "admin" | "member";

import { SupabaseClient } from "@supabase/supabase-js";

// Helper function to verify the executor's authorization level
async function verifyAdminAccess(
  supabase: SupabaseClient,
  requiredRole: "admin" | "super_admin" = "admin",
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized: No active session.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;

  if (requiredRole === "super_admin" && role !== "super_admin") {
    throw new Error("Forbidden: Super Admin privileges required.");
  }

  if (requiredRole === "admin" && role !== "admin" && role !== "super_admin") {
    throw new Error("Forbidden: Admin privileges required.");
  }

  return { user, role };
}

/**
 * Approves a user's account
 */
export async function approveUser(userId: string) {
  try {
    const supabase = await createClient();
    const { user, role } = await verifyAdminAccess(supabase, "admin");

    if (userId === user.id) {
      throw new Error("You cannot approve yourself.");
    }

    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (targetProfile?.role === "super_admin") {
      throw new Error("Cannot modify a super admin account.");
    }

    if (role === "admin" && targetProfile?.role === "admin") {
      throw new Error("Admins cannot approve other admins.");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ is_approved: true })
      .eq("id", userId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error(
        "Update failed. Missing Database RLS UPDATE policy or user not found.",
      );
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User approved successfully." };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Bans or unbans a user's account
 */
export async function toggleUserBan(userId: string, targetBanStatus: boolean) {
  try {
    const supabase = await createClient();
    // Only super_admin or admin can ban users
    const { user, role } = await verifyAdminAccess(supabase, "admin");

    if (userId === user.id) {
      throw new Error("You cannot ban or unban yourself.");
    }

    // We MUST prevent an admin from banning a super_admin.
    // Let's check the target user's role first.
    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (targetProfile?.role === "super_admin") {
      throw new Error("Cannot modify a super admin account.");
    }

    if (role === "admin" && targetProfile?.role === "admin") {
      throw new Error("Admins cannot ban or unban other admins.");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ is_banned: targetBanStatus })
      .eq("id", userId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error(
        "Update failed. Missing Database RLS UPDATE policy or user not found.",
      );
    }

    revalidatePath("/admin/users");
    return {
      success: true,
      message: `User ${targetBanStatus ? "banned" : "unbanned"} successfully.`,
    };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Changes a user's role. Strictly Super Admin only.
 */
export async function changeUserRole(userId: string, newRole: UserRole) {
  try {
    const supabase = await createClient();
    // ONLY Super Admins can change roles
    const { user } = await verifyAdminAccess(supabase, "super_admin");

    if (userId === user.id) {
      throw new Error("You cannot modify your own role via the UI.");
    }

    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (targetProfile?.role === "super_admin") {
      throw new Error(
        "Super admin roles are managed manually in the DB and cannot be modified via UI.",
      );
    }

    // Optional: Protect newRole === "super_admin" if we strictly want NO super_admins created from UI
    if (newRole === "super_admin") {
      throw new Error(
        "Super admin roles are managed manually in the DB and cannot be assigned via UI.",
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error(
        "Update failed. Missing Database RLS UPDATE policy or user not found.",
      );
    }

    revalidatePath("/admin/users");
    return { success: true, message: `User role updated to ${newRole}.` };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Deletes a user. Admins can delete members, Super Admins can delete members and admins.
 */
export async function deleteUser(userId: string) {
  try {
    const supabase = await createClient();
    const { user, role } = await verifyAdminAccess(supabase, "admin");

    if (userId === user.id) {
      throw new Error("You cannot delete yourself.");
    }

    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (targetProfile?.role === "super_admin") {
      throw new Error("Cannot delete a super admin account.");
    }

    if (role === "admin" && targetProfile?.role === "admin") {
      throw new Error("Admins cannot delete other admins.");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ is_deleted: true }) // Soft delete
      .eq("id", userId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error(
        "Update failed. Missing Database RLS UPDATE policy or user not found.",
      );
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User soft-deleted successfully." };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}
