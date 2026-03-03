"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addEventIncome(
  eventId: string,
  personName: string,
  amount: number,
) {
  const supabase = await createClient();

  // Validate admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("event_accounts_income").insert({
    event_id: eventId,
    person_name: personName,
    amount,
    added_by: user.id,
  });

  if (error) {
    console.error("Error adding income:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/accounts");
  return { success: true };
}

export async function updateEventIncome(
  id: string,
  personName: string,
  amount: number,
) {
  const supabase = await createClient();

  // Validate admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("event_accounts_income")
    .update({ person_name: personName, amount })
    .eq("id", id);

  if (error) {
    console.error("Error updating income:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/accounts");
  return { success: true };
}

export async function addEventExpense(
  eventId: string,
  description: string,
  amount: number,
) {
  const supabase = await createClient();

  // Validate admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("event_accounts_expenses").insert({
    event_id: eventId,
    description,
    amount,
    added_by: user.id,
  });

  if (error) {
    console.error("Error adding expense:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/accounts");
  return { success: true };
}

export async function updateEventExpense(
  id: string,
  description: string,
  amount: number,
) {
  const supabase = await createClient();

  // Validate admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("event_accounts_expenses")
    .update({ description, amount })
    .eq("id", id);

  if (error) {
    console.error("Error updating expense:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/accounts");
  return { success: true };
}

export async function deleteEventIncome(id: string) {
  const supabase = await createClient();

  // Validate admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("event_accounts_income")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting income:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/accounts");
  return { success: true };
}

export async function deleteEventExpense(id: string) {
  const supabase = await createClient();

  // Validate admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("event_accounts_expenses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting expense:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/accounts");
  return { success: true };
}
