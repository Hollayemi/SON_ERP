"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderIcon, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDepartmentsQuery } from "@/stores/services/core";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/stores/services/usersApi";

const formSchema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters." }),
  last_name: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone_number: z.string().min(10, { message: "Please enter a valid phone number." }),
  state_office_department_id: z.string().min(1, { message: "Please select a department." }),
  user_access: z.string().min(1, { message: "Please specify user access." }),
});

const userAccessRoles = ["Employee", "Manager", "Admin", "Checker", "Reviewer", "Approver", "Procurement", "Finance"];

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery(parseInt(userId));
  const { data: departments, isLoading: departmentLoading } = useGetDepartmentsQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const user = userData?.data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      state_office_department_id: "",
      user_access: "",
    },
  });

  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        state_office_department_id: user.state_office_department?.id?.toString() || "",
        user_access: user.role || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await updateUser({
        id: parseInt(userId),
        data: {
          ...data,
          state_office_department_id: parseInt(data.state_office_department_id),
        },
      }).unwrap();

      if (response.success) {
        toast.success("User updated successfully!");
        router.push(`/dashboard/users/${userId}`);
      }
    } catch (error: any) {
      console.error("Update user error:", error);
      toast.error(error?.data?.message || "Failed to update user. Please try again.");
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">User not found</h2>
          <p className="text-muted-foreground mt-2">The user you&lsquo;re trying to edit doesn&lsquo;t exist.</p>
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href={`/dashboard/users/${userId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft />
            Back to User Details
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Edit User Information</CardTitle>
              <CardDescription>Update the user&lsquo;s personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@son.gov.ng" {...field} />
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
                        <Input type="tel" placeholder="+234 801 234 5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state_office_department_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departmentLoading ? (
                            <div className="p-2">
                              <LoaderIcon className="size-4 animate-spin" />
                            </div>
                          ) : (
                            departments?.data?.data?.map((dept: any) => (
                              <SelectItem key={dept.id} value={dept.id.toString()}>
                                {dept.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user_access"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Access Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user access" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userAccessRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Link href={`/dashboard/users/${userId}`}>
              <Button type="button" variant="outline" disabled={isUpdating}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <LoaderIcon className="size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save />
                  Update User
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
