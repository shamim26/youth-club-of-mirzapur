"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GlobalApprovalPopupProps {
  isApproved?: boolean;
}

export function GlobalApprovalPopup({ isApproved }: GlobalApprovalPopupProps) {
  const [open, setOpen] = useState(false);

  // When the component mounts or isApproved changes, show popup if explicitly false
  useEffect(() => {
    if (isApproved === false) {
      // Check session storage so we don't annoy them on every single page navigation
      // but only once per session
      const hasSeenPopup = sessionStorage.getItem("hasSeenApprovalPopup");
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setOpen(true);
          sessionStorage.setItem("hasSeenApprovalPopup", "true");
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [isApproved]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center flex-col sm:text-center space-y-3 pb-2">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center dark:bg-amber-900/30">
            <ShieldAlert className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Account Pending Approval
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/80 mt-2">
            Welcome to the Youth Club of Mirzapur!
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 p-4 rounded-xl my-2 text-sm text-foreground/80 border border-border flex flex-col items-center text-center space-y-2">
          <p>
            Your account is currently{" "}
            <span className="font-semibold text-primary">
              pending admin approval
            </span>{" "}
            before you can access all features.
          </p>
          <p className="text-muted-foreground">
            Please ask an admin in our Messenger group to approve your account.
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-3 sm:space-x-0 mt-4">
          <Link
            href="https://m.me/j/AbZNa8tiOUkOc7is/"
            target="_blank"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            <Button
              className="w-full h-11 text-base gap-2 font-semibold shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30"
              size="lg"
            >
              Go to Messenger Group <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            className="w-full h-11"
            onClick={() => setOpen(false)}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
