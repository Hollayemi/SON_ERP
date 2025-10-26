"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Shield, Building2, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitials } from "@/lib/utils";
import { mockUsers } from "../_components/mock-data";

export default function UserDetailPage() {
  const params = useParams();
  const userId = params?.id as string;

  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">User not found</h2>
          <p className="text-muted-foreground mt-2">The user you&rsquo;re looking for doesn&rsquo;t exist.</p>
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

  const roleColors: Record<string, string> = {
    "Project Manager": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "UI Designer": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    "Front-End Developer": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "Product Owner": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "Business Analyst": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    "Data Analyst": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    "Marketing Specialist": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "Software Engineer": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "Security Analyst": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "DevOps Engineer": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    "System Architect": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  };

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
          <Button variant="destructive" size="sm">
            <Trash2 />
            Delete User
          </Button>
        </div>
      </div>

      <Card className="shadow-xs">
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <Avatar className="size-24">
              <AvatarImage src={user.avatar || "/avatars/arhamkhnz.png"} alt={user.name} />
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-2xl font-semibold">{user.name}</h1>
                  <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                    <span
                      className={`mr-1 size-2 rounded-full ${user.status === "Active" ? "bg-green-500" : "bg-gray-500"}`}
                    />
                    {user.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{user.bio}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="text-muted-foreground size-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="text-muted-foreground size-4" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="text-muted-foreground size-4" />
                  <Badge variant="outline" className={`${roleColors[user.role]} border-0 font-medium`}>
                    {user.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="text-muted-foreground size-4" />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-muted-foreground size-4" />
                  <span>Joined {user.joinedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="text-muted-foreground size-4" />
                  <span>{user.address}</span>
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
                  <p className="mt-1">{user.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Email Address</p>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Phone Number</p>
                  <p className="mt-1">{user.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Department</p>
                  <p className="mt-1">{user.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Role</p>
                  <Badge variant="outline" className={`${roleColors[user.role]} mt-1 border-0 font-medium`}>
                    {user.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Status</p>
                  <Badge variant={user.status === "Active" ? "default" : "secondary"} className="mt-1">
                    {user.status}
                  </Badge>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground text-sm font-medium">Address</p>
                  <p className="mt-1">{user.address}</p>
                </div>
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
                  <p className="text-muted-foreground text-sm font-medium">Joined Date</p>
                  <p className="mt-1">{user.joinedDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Last Login</p>
                  <p className="mt-1">2 hours ago</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Two-Factor Auth</p>
                  <Badge variant="outline" className="mt-1">
                    Enabled
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>User&rsquo;s recent actions and activity log</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Edit className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Updated profile information</p>
                    <p className="text-muted-foreground text-xs">2 hours ago</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <Mail className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sent email notification</p>
                    <p className="text-muted-foreground text-xs">5 hours ago</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <Shield className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Logged in from new device</p>
                    <p className="text-muted-foreground text-xs">Yesterday at 3:42 PM</p>
                  </div>
                </div>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">View Users</p>
                    <p className="text-muted-foreground text-sm">Can view all users in the system</p>
                  </div>
                  <Badge variant="default">Granted</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Create Requests</p>
                    <p className="text-muted-foreground text-sm">Can create new requests</p>
                  </div>
                  <Badge variant="default">Granted</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Approve Requests</p>
                    <p className="text-muted-foreground text-sm">Can approve or reject requests</p>
                  </div>
                  <Badge variant="secondary">Denied</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Manage Procurement</p>
                    <p className="text-muted-foreground text-sm">Access to procurement module</p>
                  </div>
                  <Badge variant="secondary">Denied</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">View Reports</p>
                    <p className="text-muted-foreground text-sm">Access to reports and analytics</p>
                  </div>
                  <Badge variant="default">Granted</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
