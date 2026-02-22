"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { rsvpEvent, removeRsvp } from "../../actions";
import { toast } from "sonner";
import { CheckCircle2, HelpCircle, XCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RsvpComponent({
  eventId,
  isApproved,
  currentRsvpStatus,
  attendingCount,
}: {
  eventId: string;
  isApproved: boolean;
  currentRsvpStatus: "attending" | "maybe" | "not_attending" | null;
  attendingCount: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRsvp = async (
    status: "attending" | "maybe" | "not_attending",
  ) => {
    if (!isApproved) {
      toast.error("You must be an approved member to RSVP.");
      return;
    }

    setIsLoading(true);
    const { success, error } = await rsvpEvent(eventId, status);

    if (success) {
      toast.success(`RSVP updated to ${status}`);
      router.refresh();
    } else {
      toast.error(error || "Failed to update RSVP");
    }
    setIsLoading(false);
  };

  const handleRemove = async () => {
    setIsLoading(true);
    const { success, error } = await removeRsvp(eventId);

    if (success) {
      toast.success("RSVP removed");
      router.refresh();
    } else {
      toast.error(error || "Failed to remove RSVP");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Registration
        </h2>
        <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {attendingCount} Attending
        </span>
      </div>

      {!isApproved ? (
        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg flex items-start gap-2">
          <HelpCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p>
            You must be an approved, active member to register for this event.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Let us know if you&apos;ll be joining us! (Registration)
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant={
                currentRsvpStatus === "attending" ? "default" : "outline"
              }
              className="w-full justify-start"
              onClick={() => handleRsvp("attending")}
              disabled={isLoading}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Yes, I will attend
            </Button>
            <Button
              variant={currentRsvpStatus === "maybe" ? "secondary" : "outline"}
              className="w-full justify-start"
              onClick={() => handleRsvp("maybe")}
              disabled={isLoading}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Maybe
            </Button>
            <Button
              variant={
                currentRsvpStatus === "not_attending"
                  ? "destructive"
                  : "outline"
              }
              className="w-full justify-start hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleRsvp("not_attending")}
              disabled={isLoading}
            >
              <XCircle className="mr-2 h-4 w-4" />
              No, I cannot attend
            </Button>

            {currentRsvpStatus && (
              <Button
                variant="ghost"
                className="w-full text-xs text-muted-foreground hover:text-foreground mt-2"
                onClick={handleRemove}
                disabled={isLoading}
              >
                Cancel Registration
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
