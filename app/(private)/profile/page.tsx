"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { updateProfile, getApprovedMembers } from "./actions";
import { createClient } from "@/utils/supabase/client";

// Define local component types to avoid external importing errors
interface UserProfile {
  id?: string;
  email?: string;
  full_name?: string;
  phone_number?: string;
  is_approved?: boolean;
}

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone_number: z
    .string()
    .regex(/^(?:\+?88|0088)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [directory, setDirectory] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [directoryError, setDirectoryError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const supabase = createClient();

      // 1. Get Auth Data
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch full profile info for current user
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone_number, is_approved")
          .eq("id", user.id)
          .single();

        if (profile) {
          const loadedUser = {
            id: user.id,
            email: user.email,
            ...profile,
          };
          setCurrentUser(loadedUser);

          form.reset({
            full_name: profile.full_name || "",
            phone_number: profile.phone_number || "",
          });
        }
      }

      // 2. Load Directory (Action handles backend security checks)
      const dirResponse = await getApprovedMembers();
      if (dirResponse.success && dirResponse.members) {
        setDirectory(dirResponse.members);
      } else {
        setDirectoryError(dirResponse.error || "Failed to load directory");
      }

      setIsLoading(false);
    }

    loadData();
  }, [form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);

    const result = await updateProfile({
      full_name: data.full_name,
      phone_number: data.phone_number || "",
    });

    if (result.success) {
      toast.success("Profile updated successfully!");
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              full_name: data.full_name,
              phone_number: data.phone_number || "",
            }
          : null,
      );
      form.reset(data); // Resets the form's "isDirty" state
    } else {
      toast.error(result.error || "Failed to update profile");
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col h-screen items-center justify-center pt-16">
        <h2 className="text-xl font-bold">Please log in to view this page.</h2>
      </div>
    );
  }

  // Helper for rendering Fallback Avatar correctly
  const getInitials = (name?: string, email?: string) => {
    return (
      name?.substring(0, 2).toUpperCase() ||
      email?.substring(0, 2).toUpperCase() ||
      "???"
    );
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-br from-primary to-accent bg-clip-text text-transparent inline-block">
            Member Portal
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and view the club directory.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted/50 p-1 rounded-full mb-8">
            <TabsTrigger
              value="profile"
              className="rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none font-medium transition-all"
            >
              My Profile
            </TabsTrigger>
            <TabsTrigger
              value="directory"
              className="rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none font-medium transition-all"
            >
              Club Directory
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: PERSONAL PROFILE */}
          <TabsContent value="profile" className="mt-0">
            <Card className="border-border/50 bg-card shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20 bg-muted">
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                      {getInitials(currentUser.full_name, currentUser.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your contact details here.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 max-w-xl"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={currentUser.email || ""}
                        disabled
                        className="bg-muted/50 cursor-not-allowed"
                      />
                      <p className="text-[10px] text-muted-foreground ml-1">
                        Email addresses cannot be changed here.
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+880 or start with 01..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.formState.isDirty && (
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="w-full sm:w-auto mt-4 px-8"
                      >
                        {isSaving ? "Saving changes..." : "Save Changes"}
                      </Button>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: MEMBER DIRECTORY */}
          <TabsContent value="directory" className="mt-0">
            <Card className="border-border/50 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Member Directory</CardTitle>
                <CardDescription>
                  A list of all active, approved members of the club.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {directoryError ? (
                  <div className="p-8 text-center bg-destructive/5 rounded-xl border border-destructive/20 my-4">
                    <h3 className="text-lg font-semibold text-destructive mb-2">
                      Access Restricted
                    </h3>
                    <p className="text-muted-foreground">{directoryError}</p>
                    {!currentUser.is_approved && (
                      <p className="text-sm mt-4 italic">
                        Your account is currently pending approval by an
                        administrator.
                      </p>
                    )}
                  </div>
                ) : directory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No active members found in the directory.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {directory.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-muted/10 hover:bg-muted/30 transition-colors"
                      >
                        <Avatar className="h-12 w-12 border border-primary/20 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(member.full_name, member.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden min-w-0 flex-1">
                          <h4 className="font-semibold text-foreground truncate">
                            {member.full_name || "Unknown Name"}
                          </h4>
                          <div className="flex flex-col text-sm text-muted-foreground truncate mt-0.5">
                            <span className="truncate">{member.email}</span>
                            {member.phone_number && (
                              <span className="truncate text-primary/80">
                                {member.phone_number}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
