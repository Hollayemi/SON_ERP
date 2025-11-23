"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Shield, Building2, Trash2, Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { useGetUserByIdQuery, useToggleUserStatusMutation } from "@/stores/services/usersApi";
import { toast } from "sonner";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const { data, isLoading, error } = useGetUserByIdQuery(parseInt(userId));
  const [toggleStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();

  const user = data?.data;

  const handleToggleStatus = async () => {
    if (!user) return;

    try {
      const newStatus = user.status === "Active" ? "Inactive" : "Active";
      await toggleStatus({ id: user.id, status: newStatus }).unwrap();
      toast.success(`User ${newStatus === "Active" ? "activated" : "deactivated"} successfully`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-start gap-6 md:flex-row">
              <Skeleton className="size-24 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">User not found</h2>
          <p className="text-muted-foreground mt-2">The user you're looking for doesn't exist.</p>
          <Link href="/dashboard/users">
            <Button className="mt-4" variant="outline">
              <ArrowLeft />
              Back to Users
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`;
  const department = user.state_office_department?.department;
  const stateOffice = user.state_office_department?.state_office;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft />
            Back to Users
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/users/${userId}/edit`}>
            <Button variant="outline" size="sm">
              <Edit />
              Edit User
            </Button>
          </Link>
          <Button
            variant={user.status === "Active" ? "outline" : "default"}
            size="sm"
            onClick={handleToggleStatus}
            disabled={isTogglingStatus}
          >
            {isTogglingStatus ? (
              <Loader2 className="size-4 animate-spin" />
            ) : user.status === "Active" ? (
              "Deactivate"
            ) : (
              "Activate"
            )}
          </Button>
        </div>
      </div>

      <Card className="shadow-xs">
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <Avatar className="size-24">
              <AvatarImage src="" alt={fullName} />
              <AvatarFallback className="text-2xl">{getInitials(fullName)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-2xl font-semibold">{fullName}</h1>
                  <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                    <span
                      className={`mr-1 size-2 rounded-full ${user.status === "Active" ? "bg-green-500" : "bg-gray-500"}`}
                    />
                    {user.status}
                  </Badge>
                </div>
                {user.email_verified_at && (
                  <Badge variant="outline" className="mb-2">
                    Email Verified
                  </Badge>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="text-muted-foreground size-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="text-muted-foreground size-4" />
                  <span>{user.phone_number}</span>
                </div>
                {department && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="text-muted-foreground size-4" />
                    <span>{department.name}</span>
                  </div>
                )}
                {stateOffice && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="text-muted-foreground size-4" />
                    <span>{stateOffice.name}, {stateOffice.state.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-muted-foreground size-4" />
                  <span>
                    Joined{" "}
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic details about the user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Full Name</p>
                  <p className="mt-1">{fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Email Address</p>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Phone Number</p>
                  <p className="mt-1">{user.phone_number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Status</p>
                  <Badge variant={user.status === "Active" ? "default" : "secondary"} className="mt-1">
                    {user.status}
                  </Badge>
                </div>
                {department && (
                  <>
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Department</p>
                      <p className="mt-1">{department.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Department Code</p>
                      <p className="mt-1 font-mono">{department.code}</p>
                    </div>
                  </>
                )}
                {stateOffice && (
                  <>
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground text-sm font-medium">State Office</p>
                      <p className="mt-1">{stateOffice.name}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground text-sm font-medium">Office Address</p>
                      <p className="mt-1">{stateOffice.address}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>User account information and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">User ID</p>
                  <p className="mt-1 font-mono text-sm">{user.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Email Verification</p>
                  <p className="mt-1">
                    {user.email_verified_at ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Verified on {new Date(user.email_verified_at).toLocaleDateString()}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Not Verified
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Created At</p>
                  <p className="mt-1">{new Date(user.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Last Updated</p>
                  <p className="mt-1">{new Date(user.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>User's recent actions and activity log</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-center py-12 text-sm">
                Activity log feature coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>User Permissions</CardTitle>
              <CardDescription>Access rights and permissions for this user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-center py-12 text-sm">
                Permissions management feature coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}