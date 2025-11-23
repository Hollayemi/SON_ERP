"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderIcon, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateUserMutation } from "@/stores/services/usersApi";
import { useGetDepartmentsQuery } from "@/stores/services/core";

const formSchema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters." }),
  last_name: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone_number: z.string().min(10, { message: "Please enter a valid phone number." }),
  state_office_department_id: z.string().min(1, { message: "Please select a department." }),
  user_access: z.string().min(1, { message: "Please specify user access." }),
});

const userAccessRoles = ["Employee", "Manager", "Admin", "Checker", "Reviewer", "Approver", "Procurement", "Finance"];

export default function CreateUserPage() {
  const router = useRouter();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const { data: departments, isLoading: departmentLoading } = useGetDepartmentsQuery();

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await createUser({
        ...data,
        state_office_department_id: parseInt(data.state_office_department_id),
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "User created successfully!", {
          description: `${data.first_name} ${data.last_name} has been added to the system.`,
        });
        router.push("/dashboard/users");
      }
    } catch (error: any) {
      console.error("Create user error:", error);
      toast.error(error?.data?.message || "Failed to create user. Please try again.");
    }
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
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Section */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Add the user's personal details and contact information.</CardDescription>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Link href="/dashboard/users">
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderIcon className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save />
                  Create User
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}