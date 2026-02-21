"use client";

import { toast } from "sonner";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  UserCheck,
  Ban,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import {
  approveUser,
  toggleUserBan,
  changeUserRole,
  deleteUser,
  UserRole,
} from "../actions";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone_number: string | null;
  role: UserRole;
  is_approved: boolean;
  is_banned: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export function UserActionsDropdown({
  profile,
  currentUserRole,
  currentUserId,
}: {
  profile: Profile;
  currentUserRole: string;
  currentUserId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionFn:
      | (() => Promise<{ error?: string; success: boolean; message?: string }>)
      | null;
    isDestructive: boolean;
  }>({
    isOpen: false,
    title: "",
    description: "",
    actionFn: null,
    isDestructive: false,
  });

  const openConfirm = (
    title: string,
    description: string,
    actionFn: () => Promise<{
      error?: string;
      success: boolean;
      message?: string;
    }>,
    isDestructive: boolean = false,
  ) => {
    setConfirmState({
      isOpen: true,
      title,
      description,
      actionFn,
      isDestructive,
    });
  };

  const executeAction = async () => {
    if (!confirmState.actionFn) return;
    setIsLoading(true);
    try {
      const { error, success, message } = await confirmState.actionFn();
      if (error) {
        toast.error(`Error: ${error}`);
      } else if (success && message) {
        toast.success(message);
      }
      setConfirmState((prev) => ({ ...prev, isOpen: false }));
    } finally {
      setIsLoading(false);
    }
  };

  // Determine permissions
  const isSuperAdmin = currentUserRole === "super_admin";
  const isAdminOrHigher = currentUserRole === "admin" || isSuperAdmin;

  // Rule 1: No one can modify a super_admin
  const isTargetSuperAdmin = profile.role === "super_admin";
  // Rule 2: No one can modify themselves in this table
  const isSelf = profile.id === currentUserId;
  // Rule 3: Admins cannot modify other admins
  const isTargetAdmin = profile.role === "admin";

  let canModify = false;

  if (!isSelf && !isTargetSuperAdmin) {
    if (isSuperAdmin) {
      canModify = true; // Super Admin can modify members and admins
    } else if (isAdminOrHigher && !isTargetAdmin) {
      canModify = true; // Admin can modify members only
    }
  }

  if (!canModify) {
    return (
      <Button variant="ghost" className="h-8 w-8 p-0" disabled>
        <span className="sr-only">Locked</span>
        <MoreHorizontal className="h-4 w-4 text-muted-foreground/30" />
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Approve Option */}
          {!profile.is_approved && (
            <DropdownMenuItem
              onClick={() =>
                openConfirm(
                  "Approve User",
                  `Are you sure you want to approve ${profile.full_name || "this user"}?`,
                  () => approveUser(profile.id),
                )
              }
              disabled={isLoading}
              className="text-green-500 focus:text-green-500 focus:bg-green-500/10 cursor-pointer"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Approve Member
            </DropdownMenuItem>
          )}

          {/* Ban / Unban Option */}
          <DropdownMenuItem
            onClick={() =>
              openConfirm(
                profile.is_banned ? "Unban User" : "Ban User",
                `Are you sure you want to ${profile.is_banned ? "unban" : "ban"} ${profile.full_name || "this user"}?`,
                () => toggleUserBan(profile.id, !profile.is_banned),
                !profile.is_banned,
              )
            }
            disabled={isLoading}
            className="text-amber-500 focus:text-amber-500 focus:bg-amber-500/10 cursor-pointer"
          >
            <Ban className="mr-2 h-4 w-4" />
            {profile.is_banned ? "Unban User" : "Ban User"}
          </DropdownMenuItem>

          {/* Role Change - SUPER ADMIN ONLY */}
          {isSuperAdmin && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Change Role
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() =>
                      openConfirm(
                        "Change Role to Member",
                        `Are you sure you want to make ${profile.full_name || "this user"} a Member?`,
                        () => changeUserRole(profile.id, "member"),
                      )
                    }
                  >
                    Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      openConfirm(
                        "Change Role to Admin",
                        `Are you sure you want to promote ${profile.full_name || "this user"} to Admin?`,
                        () => changeUserRole(profile.id, "admin"),
                      )
                    }
                  >
                    Admin
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}

          {/* Delete Member/Admin */}
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                openConfirm(
                  "Delete User",
                  `Are you sure you want to delete ${profile.full_name || "this user"}? This action cannot be easily undone.`,
                  () => deleteUser(profile.id),
                  true,
                )
              }
              disabled={isLoading}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={confirmState.isOpen}
        onOpenChange={(open) =>
          setConfirmState((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmState.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmState.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Keep dialog open while loading
                executeAction();
              }}
              disabled={isLoading}
              className={
                confirmState.isDestructive
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {isLoading ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
