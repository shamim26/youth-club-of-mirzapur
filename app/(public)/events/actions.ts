"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyAdminAccess } from "../../(private)/admin/users/actions";

// Helper function to verify executor is an approved user
async function verifyApprovedMember() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_approved, is_banned, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Could not fetch user profile.");
  }

  if (profile.is_banned) {
    throw new Error("Forbidden: Your account has been banned.");
  }

  if (
    !profile.is_approved &&
    profile.role !== "admin" &&
    profile.role !== "super_admin"
  ) {
    throw new Error(
      "Forbidden: Your account must be approved to perform this action.",
    );
  }

  return { supabase, user, profile };
}

export async function rsvpEvent(
  eventId: string,
  status: "attending" | "maybe" | "not_attending",
) {
  try {
    const { supabase, user } = await verifyApprovedMember();

    // Check if event is published
    const { data: event } = await supabase
      .from("events")
      .select("is_published")
      .eq("id", eventId)
      .single();

    if (!event?.is_published) {
      // Admins might RSVP to unpublished events, but let's keep it simple
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role !== "admin" && profile?.role !== "super_admin") {
        throw new Error("Event is not published.");
      }
    }

    // Upsert RSVP (Conflict on event_id, user_id)
    const { error } = await supabase
      .from("event_rsvps")
      .upsert(
        { event_id: eventId, user_id: user.id, status },
        { onConflict: "event_id,user_id" },
      );

    if (error) throw error;

    revalidatePath(`/events/${eventId}`);
    revalidatePath(`/admin/events/${eventId}`);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function removeRsvp(eventId: string) {
  try {
    const { supabase, user } = await verifyApprovedMember();

    const { error } = await supabase
      .from("event_rsvps")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath(`/events/${eventId}`);
    revalidatePath(`/admin/events/${eventId}`);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function votePoll(
  pollId: string,
  optionId: string,
  eventId: string,
) {
  try {
    const { supabase, user } = await verifyApprovedMember();

    // Check if poll option matches poll
    const { data: option } = await supabase
      .from("event_poll_options")
      .select("id")
      .eq("id", optionId)
      .eq("poll_id", pollId)
      .single();

    if (!option) throw new Error("Invalid poll option.");

    // Upsert vote (Conflict on poll_id, user_id)
    const { error } = await supabase
      .from("event_poll_votes")
      .upsert(
        { poll_id: pollId, option_id: optionId, user_id: user.id },
        { onConflict: "poll_id,user_id" },
      );

    if (error) throw error;

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function addComment(eventId: string, text: string) {
  try {
    const { supabase, user } = await verifyApprovedMember();

    if (!text.trim()) {
      throw new Error("Comment cannot be empty.");
    }

    const { error } = await supabase
      .from("event_comments")
      .insert([{ event_id: eventId, user_id: user.id, text: text.trim() }]);

    if (error) throw error;

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteMyComment(commentId: string, eventId: string) {
  try {
    const { supabase, user } = await verifyApprovedMember();

    const { error } = await supabase
      .from("event_comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function updatePaymentStatus(
  eventId: string,
  userId: string,
  paymentStatus: "paid" | "unpaid",
) {
  try {
    const supabase = await createClient();
    await verifyAdminAccess(supabase, "admin");

    const { error } = await supabase
      .from("event_rsvps")
      .update({ payment_status: paymentStatus })
      .eq("event_id", eventId)
      .eq("user_id", userId);

    if (error) throw error;

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}
