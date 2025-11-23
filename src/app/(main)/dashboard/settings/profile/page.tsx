"use client";

import { Mail, Phone, MapPin, Calendar, Shield, Edit } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/hooks/use-user-profile";

export default function UserProfilePage() {
  const { profile, isLoading, error } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-70 w-full" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Failed to load profile</h2>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const lastUpdated = new Date(profile.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <Card className="shadow-xs">
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <Avatar className="size-24">
              <AvatarImage src="" alt={profile.fullName} />
              <AvatarFallback className="text-2xl">{profile.initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold">{profile.fullName}</h1>
                  <Badge variant={profile.isActive ? "default" : "secondary"}>
                    <span className={`mr-1 size-2 rounded-full ${profile.isActive ? "bg-green-500" : "bg-gray-500"}`} />
                    {profile.status}
                  </Badge>
                  {profile.isEmailVerified && (
                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                      Email Verified
                    </Badge>
                  )}
                </div>
                {profile.role && (
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Shield className="size-4" />
                    {profile.role}
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="text-muted-foreground size-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="text-muted-foreground size-4" />
                  <span>{profile.phone_number || "Not provided"}</span>
                </div>
                {profile.state_office_department && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="text-muted-foreground size-4" />
                    <span>{profile.state_office_department}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-muted-foreground size-4" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>
            </div>

            <Button>
              <Edit />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">User ID</p>
                  <p className="mt-1 font-mono text-sm">#{profile.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">First Name</p>
                  <p className="mt-1">{profile.first_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Last Name</p>
                  <p className="mt-1">{profile.last_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Email Address</p>
                  <p className="mt-1">{profile.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Phone Number</p>
                  <p className="mt-1">{profile.phone_number || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Account Status</p>
                  <Badge variant={profile.isActive ? "default" : "secondary"} className="mt-1">
                    {profile.status}
                  </Badge>
                </div>
                {profile.state_office_department && (
                  <div className="sm:col-span-2">
                    <p className="text-muted-foreground text-sm font-medium">Department/Office</p>
                    <p className="mt-1">{profile.state_office_department}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Account creation and verification details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Account Created</p>
                  <p className="mt-1">{joinDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Last Updated</p>
                  <p className="mt-1">{lastUpdated}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Email Verification</p>
                  <Badge variant={profile.isEmailVerified ? "default" : "secondary"} className="mt-1">
                    {profile.isEmailVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
                {profile.isEmailVerified && profile.email_verified_at && (
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Verified On</p>
                    <p className="mt-1">
                      {new Date(profile.email_verified_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and activity log</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Shield className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Profile updated</p>
                    <p className="text-muted-foreground text-xs">{lastUpdated}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Calendar className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Account created</p>
                    <p className="text-muted-foreground text-xs">{joinDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-muted-foreground text-sm">Change your account password</p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-muted-foreground text-sm">Add an extra layer of security</p>
                  </div>
                  <Badge variant="secondary">Not Enabled</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-muted-foreground text-sm">Verify your email address</p>
                  </div>
                  <Badge variant={profile.isEmailVerified ? "default" : "secondary"}>
                    {profile.isEmailVerified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
