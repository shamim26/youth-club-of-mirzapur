"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addComment, deleteMyComment } from "../../actions";
import { deleteComment as adminDeleteComment } from "@/app/(private)/admin/events/actions";
import { toast } from "sonner";
import { MessageSquare, Trash2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";

export default function CommentsComponent({
  eventId,
  comments,
  isApproved,
  isAdmin,
  currentUserId,
}: {
  eventId: string;
  comments: {
    id: string;
    user_id: string;
    text: string;
    created_at: string;
    profiles?: {
      full_name?: string;
    };
  }[];
  isApproved: boolean;
  isAdmin: boolean;
  currentUserId?: string;
}) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState(comments);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  useEffect(() => {
    const channel = supabase
      .channel(`comments-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_comments",
          filter: `event_id=eq.${eventId}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Fetch profile for the new comment
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", payload.new.user_id)
              .single();

            const newCommentObj = {
              id: payload.new.id,
              user_id: payload.new.user_id,
              text: payload.new.text,
              created_at: payload.new.created_at,
              profiles: profile || undefined,
            };

            setLocalComments((prev) => {
              if (prev.find((c) => c.id === newCommentObj.id)) return prev;

              const updated = [...prev, newCommentObj];
              return updated.sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime(),
              );
            });
          } else if (payload.eventType === "DELETE") {
            setLocalComments((prev) =>
              prev.filter((c) => c.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, supabase]);

  console.log(localComments);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    if (!isApproved) {
      toast.error("You must be an approved member to comment.");
      return;
    }

    setIsSubmitting(true);
    const { success, error } = await addComment(eventId, newComment);

    if (success) {
      toast.success("Comment posted");
      setNewComment("");
      router.refresh();
    } else {
      toast.error(error || "Failed to post comment");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (commentId: string, isOwnComment: boolean) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    const { success, error } = isOwnComment
      ? await deleteMyComment(commentId, eventId)
      : await adminDeleteComment(commentId, eventId);

    if (success) {
      toast.success("Comment deleted");
      router.refresh();
    } else {
      toast.error(error || "Failed to delete comment");
    }
  };

  return (
    <div className="bg-card rounded-xl border p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Discussion</h2>
      </div>

      <div className="space-y-6 mt-6">
        {localComments.map((comment) => {
          const isOwnComment = comment.user_id === currentUserId;
          const userInitials = comment.profiles?.full_name?.[0] || "U";

          return (
            <div key={comment.id} className="flex gap-4 group">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {comment.profiles?.full_name || "Unknown User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {(isOwnComment || isAdmin) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(comment.id, isOwnComment)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
            </div>
          );
        })}

        {localComments.length === 0 && (
          <p className="text-center text-muted-foreground py-6 border border-dashed rounded-lg">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>

      {isApproved ? (
        <div className="mt-8 pt-6 border-t flex gap-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary">
              ME
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2 relative">
            <textarea
              placeholder="Add your comment..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y pr-12"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
            />
            <Button
              size="icon"
              className="absolute bottom-3 right-3 h-8 w-8 rounded-full"
              onClick={handlePostComment}
              disabled={isSubmitting || !newComment.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          You must be an approved member to join the discussion.
        </div>
      )}
    </div>
  );
}
