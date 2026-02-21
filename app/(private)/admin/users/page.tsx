import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { UserActionsDropdown } from "./UserActionsDropdown";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Get current user role to pass down to client components for permission checking
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: currentAdmin } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  const currentUserRole = currentAdmin?.role || "member";

  // Fetch all profiles
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    // Hide 'deleted' users from default view, or you could add a filter toggle later
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching profiles:", error);
    return <div>Error loading users.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      </div>

      <div className="rounded-md border border-border/50 bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[250px]">User</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => {
              const userInitials =
                profile.full_name?.substring(0, 2).toUpperCase() ||
                profile.email?.substring(0, 2).toUpperCase() ||
                "US";

              return (
                <TableRow key={profile.id}>
                  {/* Avatar & Name & Email */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">
                          {profile.full_name || "Unknown Name"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {profile.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="text-sm text-foreground">
                    {profile.phone_number || (
                      <span className="text-muted-foreground italic">None</span>
                    )}
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <Badge
                      variant={
                        profile.role === "super_admin"
                          ? "destructive"
                          : profile.role === "admin"
                            ? "default"
                            : "secondary"
                      }
                      className={
                        profile.role === "super_admin"
                          ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                          : profile.role === "admin"
                            ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                            : ""
                      }
                    >
                      {profile.role.replace("_", " ")}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex gap-2">
                      {profile.is_banned && (
                        <Badge
                          variant="destructive"
                          className="bg-destructive/10 text-destructive border-transparent"
                        >
                          Banned
                        </Badge>
                      )}
                      {!profile.is_approved && !profile.is_banned && (
                        <Badge
                          variant="outline"
                          className="text-amber-500 border-amber-500/50 bg-amber-500/10"
                        >
                          Pending
                        </Badge>
                      )}
                      {profile.is_approved && !profile.is_banned && (
                        <Badge
                          variant="outline"
                          className="text-green-500 border-green-500/50 bg-green-500/10"
                        >
                          Active
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Joined Date */}
                  <TableCell className="text-sm text-muted-foreground">
                    {profile.created_at
                      ? format(new Date(profile.created_at), "MMM d, yyyy")
                      : "Unknown"}
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="text-right">
                    <UserActionsDropdown
                      profile={profile}
                      currentUserRole={currentUserRole}
                      currentUserId={user?.id || ""}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            {(!profiles || profiles.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
