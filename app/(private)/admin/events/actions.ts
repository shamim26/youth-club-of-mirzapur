"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyAdminAccess } from "@/app/(private)/admin/users/actions";

export async function createEvent(data: {
  title: string;
  description: string;
  event_date: string;
  location: string;
  dynamic_data: Record<string, unknown>;
  is_published: boolean;
  polls?: { question: string; options: { text: string }[] }[];
}) {
  try {
    const supabase = await createClient();
    await verifyAdminAccess(supabase, "admin");

    const { data: newEvent, error } = await supabase
      .from("events")
      .insert([
        {
          title: data.title,
          description: data.description,
          event_date: data.event_date,
          location: data.location,
          dynamic_data: data.dynamic_data,
          is_published: data.is_published,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Handle initial poll creations
    if (data.polls && data.polls.length > 0 && newEvent) {
      for (const poll of data.polls) {
        if (!poll.question || poll.options.length < 2) continue;

        const { data: createdPoll, error: pollError } = await supabase
          .from("event_polls")
          .insert([{ event_id: newEvent.id, question: poll.question }])
          .select()
          .single();

        if (!pollError && createdPoll) {
          const optionsData = poll.options
            .filter((o) => o.text.trim())
            .map((o) => ({ poll_id: createdPoll.id, text: o.text }));

          if (optionsData.length > 0) {
            await supabase.from("event_poll_options").insert(optionsData);
          }
        }
      }
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true, data: newEvent };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function updateEvent(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    event_date: string;
    location: string;
    dynamic_data: Record<string, unknown>;
    is_published: boolean;
    polls?: {
      id?: string;
      question: string;
      options: { id?: string; text: string }[];
    }[];
  }>,
) {
  try {
    const supabase = await createClient();
    await verifyAdminAccess(supabase, "admin");

    const { polls, ...eventData } = data;

    const { data: updatedEvent, error } = await supabase
      .from("events")
      .update({
        ...eventData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (polls) {
      // 1. Fetch existing polls
      const { data: existingPolls, error: fetchPollsError } = await supabase
        .from("event_polls")
        .select("id")
        .eq("event_id", id);

      if (fetchPollsError) throw fetchPollsError;

      const existingPollIds =
        existingPolls?.map((p: { id: string }) => p.id) || [];
      const submittedPollIds = polls
        .map((p: { id?: string }) => p.id)
        .filter(Boolean) as string[];

      // 2. Delete removed polls
      const pollsToDelete = existingPollIds.filter(
        (pid: string) => !submittedPollIds.includes(pid),
      );
      if (pollsToDelete.length > 0) {
        const { error: delPollError } = await supabase
          .from("event_polls")
          .delete()
          .in("id", pollsToDelete);
        if (delPollError) throw delPollError;
      }

      // 3. Process each poll
      for (const poll of polls) {
        if (!poll.question || poll.options.length < 2) continue;

        let pollId = poll.id;

        if (pollId) {
          // Update existing poll
          const { error: upSubPollError } = await supabase
            .from("event_polls")
            .update({ question: poll.question })
            .eq("id", pollId);
          if (upSubPollError) throw upSubPollError;
        } else {
          // Create new poll
          const { data: createdPoll, error: insPollError } = await supabase
            .from("event_polls")
            .insert([{ event_id: id, question: poll.question }])
            .select()
            .single();

          if (insPollError) throw insPollError;
          if (createdPoll) pollId = createdPoll.id;
        }

        if (pollId) {
          // Sync options for this poll
          const { data: existingOpts, error: fetchOptsError } = await supabase
            .from("event_poll_options")
            .select("id")
            .eq("poll_id", pollId);

          if (fetchOptsError) throw fetchOptsError;

          const existingOptIds =
            existingOpts?.map((o: { id: string }) => o.id) || [];
          const submittedOptIds = poll.options
            .map((o: { id?: string }) => o.id)
            .filter(Boolean) as string[];

          // Delete removed options
          const optsToDelete = existingOptIds.filter(
            (oid: string) => !submittedOptIds.includes(oid),
          );
          if (optsToDelete.length > 0) {
            const { error: delOptsError } = await supabase
              .from("event_poll_options")
              .delete()
              .in("id", optsToDelete);
            if (delOptsError) throw delOptsError;
          }

          // Sync options
          for (const opt of poll.options) {
            if (!opt.text.trim()) continue;
            if (opt.id) {
              const { error: upOptError } = await supabase
                .from("event_poll_options")
                .update({ text: opt.text })
                .eq("id", opt.id);
              if (upOptError) throw upOptError;
            } else {
              const { error: insOptError } = await supabase
                .from("event_poll_options")
                .insert({ poll_id: pollId, text: opt.text });
              if (insOptError) throw insOptError;
            }
          }
        }
      }
    }

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);
    revalidatePath("/events");
    revalidatePath(`/events/${id}`);
    return { success: true, data: updatedEvent };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteEvent(id: string) {
  try {
    const supabase = await createClient();
    await verifyAdminAccess(supabase, "admin");

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) throw error;
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

// Polls
export async function createPoll(
  eventId: string,
  question: string,
  options: string[],
) {
  try {
    const supabase = await createClient();
    await verifyAdminAccess(supabase, "admin");

    // 1. Create Poll
    const { data: poll, error: pollError } = await supabase
      .from("event_polls")
      .insert([{ event_id: eventId, question }])
      .select()
      .single();

    if (pollError) throw pollError;

    // 2. Create Options
    const optionsData = options.map((opt) => ({
      poll_id: poll.id,
      text: opt,
    }));

    const { error: optionsError } = await supabase
      .from("event_poll_options")
      .insert(optionsData);

    if (optionsError) throw optionsError;

    revalidatePath(`/admin/events/${eventId}`);
    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deletePoll(pollId: string, eventId: string) {
  try {
    const supabase = await createClient();
    await verifyAdminAccess(supabase, "admin");

    const { error } = await supabase
      .from("event_polls")
      .delete()
      .eq("id", pollId);

    if (error) throw error;

    revalidatePath(`/admin/events/${eventId}`);
    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

// Moderation
export async function deleteComment(commentId: string, eventId: string) {
  try {
    const supabase = await createClient();
    await verifyAdminAccess(supabase, "admin");

    const { error } = await supabase
      .from("event_comments")
      .delete()
      .eq("id", commentId);

    if (error) throw error;

    revalidatePath(`/events/${eventId}`); // Comments only show on public page
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

// Photos Direct Upload
export async function uploadEventPhotos(formData: FormData) {
  try {
    const supabase = await createClient();
    const { user } = await verifyAdminAccess(supabase, "admin");

    const eventId = formData.get("eventId") as string;
    const eventTitle = formData.get("eventTitle") as string;
    const files = formData.getAll("files") as File[];
    const caption = formData.get("caption") as string | null;

    if (!eventId || !eventTitle || files.length === 0) {
      throw new Error("Missing event ID, title, or files");
    }

    const uploadedRecords = [];
    const folderName = eventTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    for (const file of files) {
      if (!file || typeof file === "string") continue;

      const fileExt = file.name.split(".").pop();
      const fileName = `${folderName}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Convert the FormData File into a format Supabase can reliably upload from edge/Node
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload file buffer to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("event-photos")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase Storage Upload error:", uploadError);
        throw new Error(
          `Storage upload failed: ${uploadError.message}. Did you create the public 'event-photos' bucket and add RLS policies?`,
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from("event-photos")
        .getPublicUrl(fileName);

      uploadedRecords.push({
        event_id: eventId,
        url: publicUrlData.publicUrl,
        caption: caption || null,
        uploaded_by: user.id,
      });
    }

    if (uploadedRecords.length > 0) {
      const { error: dbError } = await supabase
        .from("event_photos")
        .insert(uploadedRecords);

      if (dbError) throw dbError;
    }

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteEventPhoto(photoId: string, eventId: string) {
  try {
    const supabase = await createClient();
    await verifyAdminAccess(supabase, "admin");

    const { error } = await supabase
      .from("event_photos")
      .delete()
      .eq("id", photoId);

    if (error) throw error;

    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}
