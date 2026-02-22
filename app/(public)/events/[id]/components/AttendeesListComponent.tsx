"use client";

import { useState } from "react";
import { Users, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { updatePaymentStatus } from "../../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Attendee {
  user_id: string;
  status: "attending" | "maybe" | "not_attending";
  payment_status: "paid" | "unpaid";
  profiles: {
    full_name: string;
  } | null;
}

export default function AttendeesListComponent({
  attendees,
  eventId,
  isAdmin,
  currentUserId,
}: {
  attendees: Attendee[];
  eventId: string;
  isAdmin: boolean;
  currentUserId: string | null;
}) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const router = useRouter();

  const handlePaymentToggle = async (
    userId: string,
    newStatus: "paid" | "unpaid",
  ) => {
    setIsUpdating(userId);
    const { success, error } = await updatePaymentStatus(
      eventId,
      userId,
      newStatus,
    );

    if (success) {
      toast.success("Payment status updated");
      router.refresh();
    } else {
      toast.error(error || "Failed to update payment status");
    }
    setIsUpdating(null);
  };

  const attendingList = attendees.filter((a) => a.status === "attending");
  const totalAttending = attendingList.length;

  return (
    <div className="bg-card rounded-xl border shadow-sm flex flex-col h-[450px]">
      <div className="p-4 border-b flex items-center justify-between bg-muted/5">
        <h2 className="font-bold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Attendees List
        </h2>
        <Badge variant="secondary" className="font-bold">
          {totalAttending} Members
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {attendingList.length > 0 ? (
          attendingList.map((attendee, index) => {
            const isSelf = attendee.user_id === currentUserId;
            const displayName =
              attendee.profiles?.full_name || "Unknown Member";

            return (
              <div
                key={attendee.user_id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  isSelf
                    ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10"
                    : "bg-background hover:border-muted-foreground/20"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold ring-1 ring-primary/20">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate flex items-center gap-2">
                      {displayName}
                      {isSelf && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-4 px-1 bg-primary/10 text-primary border-primary/20"
                        >
                          You
                        </Badge>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <Select
                      defaultValue={attendee.payment_status}
                      onValueChange={(val: "paid" | "unpaid") =>
                        handlePaymentToggle(attendee.user_id, val)
                      }
                      disabled={isUpdating === attendee.user_id}
                    >
                      <SelectTrigger
                        className={`h-8 w-[85px] text-[11px] font-bold ${
                          attendee.payment_status === "paid"
                            ? "bg-green-500/10 text-green-600 border-green-200"
                            : "bg-orange-500/10 text-orange-600 border-orange-200"
                        }`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    currentUserId && (
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-bold flex items-center gap-1 ${
                          attendee.payment_status === "paid"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-orange-500/10 text-orange-600"
                        }`}
                      >
                        <DollarSign className="h-2.5 w-2.5" />
                        {attendee.payment_status.toUpperCase()}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
            <Users className="h-8 w-8 opacity-20 mb-2" />
            <p className="text-sm">No confirmed attendees yet</p>
          </div>
        )}
      </div>

      <div className="p-3 bg-muted/30 border-t text-[10px] text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Real-time updates
        </div>
        <div className="font-medium text-primary/60">
          Youth Club of Mirzapur
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.2);
        }
      `}</style>
    </div>
  );
}
