"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function signInWithEmail(data: {
  identifier: string;
  password: string;
}) {
  const supabase = await createClient();

  // Try to login assuming it's an email
  const result = await supabase.auth.signInWithPassword({
    email: data.identifier,
    password: data.password,
  });

  // If email login fails or it's not an email, we could try phone
  // (Note: Supabase requires setting up phone providers like Twilio for OTP.
  // If they just registered phone in metadata, they still use email to login currently unless setup)

  if (result.error) {
    return { success: false, error: result.error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signUpWithEmail(data: {
  fullName: string;
  phone?: string;
  email: string;
  password: string;
}) {
  const supabase = await createClient();

  // If no email is provided, we might need a fake one or use phone auth.
  // Assuming email is used as primary identity for now, or phone if configured.
  // If email is optional but required by Supabase, we derive a dummy one if empty:
  const emailToUse =
    data.email && data.email.trim() !== ""
      ? data.email
      : `${data.phone?.replace(/[^0-9]/g, "")}@example.com`; // fallback

  const result = await supabase.auth.signUp({
    email: emailToUse,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        phone_number: data.phone,
      },
    },
  });

  if (result.error) {
    return { success: false, error: result.error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
