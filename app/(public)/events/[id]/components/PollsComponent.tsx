"use client";

import { useState } from "react";
import { votePoll } from "../../actions";
import { toast } from "sonner";
import { PieChart, HelpCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PollsComponent({
  eventId,
  polls,
  isApproved,
}: {
  eventId: string;
  polls: {
    id: string;
    question: string;
    userVote?: string | null;
    event_poll_options: {
      id: string;
      text: string;
      votes_count?: number;
      voters?: string[];
    }[];
  }[];
  isApproved: boolean;
}) {
  const [isVoting, setIsVoting] = useState(false);
  const router = useRouter();
  const [activePollModal, setActivePollModal] = useState<string | null>(null);

  const handleVote = async (pollId: string, selectedOption: string) => {
    if (!isApproved) {
      toast.error("You must be an approved member to vote.");
      return;
    }

    setIsVoting(true);
    const { success, error } = await votePoll(pollId, selectedOption, eventId);

    if (success) {
      toast.success("Vote recorded successfully.");
      router.refresh();
    } else {
      toast.error(error || "Failed to record vote.");
    }
    setIsVoting(false);
  };

  if (!polls || polls.length === 0) return null;

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm space-y-8">
      <div className="flex items-center gap-2">
        <PieChart className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Event Polls</h2>
      </div>

      {!isApproved && (
        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg flex items-start gap-2 mb-4">
          <HelpCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p>You must be an approved, active member to participate in polls.</p>
        </div>
      )}

      <div className="space-y-8">
        {polls.map((poll) => {
          const totalVotes = Array.isArray(poll.event_poll_options)
            ? poll.event_poll_options.reduce(
                (sum, opt) => sum + (opt.votes_count || 0),
                0,
              )
            : 0;

          const hasVoted = !!poll.userVote;

          return (
            <div key={poll.id} className="space-y-4">
              <h3 className="font-semibold text-lg">{poll.question}</h3>

              {hasVoted ? (
                <div className="space-y-3">
                  {Array.isArray(poll.event_poll_options) &&
                    poll.event_poll_options.map((opt) => {
                      const percentage =
                        totalVotes > 0
                          ? Math.round(
                              ((opt.votes_count || 0) / totalVotes) * 100,
                            )
                          : 0;
                      const isUserChoice = opt.id === poll.userVote;

                      return (
                        <div
                          key={opt.id}
                          className={`relative pt-1 cursor-pointer transition-opacity border rounded-lg p-3 ${isUserChoice ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"} ${isVoting ? "opacity-50 pointer-events-none" : ""}`}
                          onClick={() => {
                            if (!isUserChoice) {
                              handleVote(poll.id, opt.id);
                            }
                          }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span
                              className={`text-sm font-medium flex items-center gap-2 ${isUserChoice ? "text-primary flex-1" : "flex-1"}`}
                            >
                              <div
                                className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${isUserChoice ? "border-primary text-primary" : "border-muted-foreground"}`}
                              >
                                {isUserChoice && (
                                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                )}
                              </div>
                              {opt.text}
                            </span>
                            <span className="text-sm font-medium text-muted-foreground ml-4">
                              {percentage}% ({opt.votes_count || 0})
                            </span>
                          </div>
                          <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-muted">
                            <div
                              style={{ width: `${percentage}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500 ease-in-out"
                            />
                          </div>
                        </div>
                      );
                    })}
                  <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                    <button
                      className="hover:text-primary flex items-center gap-1 transition-colors font-medium border px-3 py-1.5 rounded bg-muted/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePollModal(poll.id);
                      }}
                    >
                      <Users className="h-3.5 w-3.5" /> View Voter Details
                    </button>
                    <span>{totalVotes} total votes</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {Array.isArray(poll.event_poll_options) &&
                      poll.event_poll_options.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center space-x-2 border p-3 rounded-lg cursor-pointer transition-colors ${isVoting ? "opacity-50" : "hover:bg-muted/50"}`}
                        >
                          <input
                            type="radio"
                            name={`poll-${poll.id}`}
                            value={opt.id}
                            onChange={() => handleVote(poll.id, opt.id)}
                            disabled={!isApproved || isVoting}
                            className="h-4 w-4 bg-background border-primary text-primary focus:ring-primary"
                          />
                          <span className="flex-1 cursor-pointer text-sm font-medium">
                            {opt.text}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              )}

              {/* Poll Voters Modal */}
              <Dialog
                open={activePollModal === poll.id}
                onOpenChange={(open) => !open && setActivePollModal(null)}
              >
                <DialogContent className="max-w-md sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{poll.question}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4 max-h-[60vh] overflow-y-auto pr-2">
                    {poll.event_poll_options.map((opt) => (
                      <div key={`modal-opt-${opt.id}`} className="space-y-3">
                        <div className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-md">
                          <h4 className="font-semibold text-sm">{opt.text}</h4>
                          <span className="text-primary text-sm font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                            {opt.votes_count || 0}
                          </span>
                        </div>
                        <div className="pl-2 space-y-2">
                          {opt.voters && opt.voters.length > 0 ? (
                            opt.voters.map((voter, idx) => (
                              <p
                                key={idx}
                                className="text-sm text-muted-foreground flex items-center gap-3 animate-in fade-in slide-in-from-left-2"
                                style={{
                                  animationDelay: `${idx * 50}ms`,
                                  animationFillMode: "both",
                                }}
                              >
                                <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                  {voter[0]?.toUpperCase() || "U"}
                                </span>
                                {voter}
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground/50 italic py-1">
                              No votes yet for this option
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          );
        })}
      </div>
    </div>
  );
}
