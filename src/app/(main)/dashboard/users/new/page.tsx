"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderIcon, Save, Upload, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCreateUserMutation } from "@/stores/services/usersApi";
import { useGetDepartmentsQuery } from "@/stores/services/core";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z
  .object({
    first_name: z.string().min(2, { message: "First name must be at least 2 characters." }),
    last_name: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().min(10, { message: "Please enter a valid phone number." }).optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Please confirm your password." }),
    department_id: z.string().min(1, { message: "Please select a department." }),
    employee_id: z.string().min(1, { message: "Employee ID is required." }),
    user_access: z.array(z.string()).min(1, { message: "Select at least one access role." }),
    address: z.string().min(5, { message: "Address must be at least 5 characters." }),
    bio: z.string().optional(),
    image: z.any().optional(),
    isActive: z.boolean().default(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// Mock data - replace with actual API calls
const departments = [
  { id: "1", name: "Engineering" },
  { id: "2", name: "Finance" },
  { id: "3", name: "Human Resources" },
  { id: "4", name: "Operations" },
  { id: "5", name: "Procurement" },
  { id: "6", name: "IT" },
  { id: "7", name: "Administration" },
];

const userAccessRoles = ["Employee", "Manager", "Admin", "Checker", "Reviewer", "Approver", "Procurement", "Finance"];

export default function CreateUserPage() {
  const router = useRouter();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const { data: departments, isLoading: departmentLoading } = useGetDepartmentsQuery();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      department_id: "",
      employee_id: "",
      user_access: [],
      address: "",
      bio: "",
      isActive: true,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 2MB.");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    form.setValue("image", undefined);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();

      // Append all form fields
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("department_id", data.department_id);
      formData.append("employee_id", data.employee_id);

      // Append optional fields
      if (data.phone) {
        formData.append("phone", data.phone);
      }

      // Append user access as JSON array
      formData.append("user_access", JSON.stringify(data.user_access));

      // Append image if selected
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await createUser(formData).unwrap();

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
          {/* Profile Image Section */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
              <CardDescription>Upload a profile picture for the user (optional).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        width={96}
                        height={96}
                        className="rounded-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <div className="bg-muted flex h-24 w-24 items-center justify-center rounded-full">
                      <Upload className="text-muted-foreground h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                  <FormDescription className="!mt-3 text-xs">
                    Recommended: Square image, 2MB max. Supported formats: JPEG, PNG, WebP.
                  </FormDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information Section */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Add the user&rsquo;s personal details and contact information.</CardDescription>
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
                        <Input placeholder="Aliyu" {...field} />
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
                        <Input placeholder="Usman" {...field} />
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
                        <Input type="email" placeholder="aliyu.usman@son.com.ng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
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
                  name="employee_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input placeholder="EMP001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department_id"
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
                            <LoaderIcon className="animate-spin" />
                          ) : (
                            departments?.data?.map((dept: any) => (
                              <SelectItem key={dept.id} value={dept.id}>
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
                  name="address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street, Abuja, Nigeria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Bio (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description about the user..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short description about the user&rsquo;s role and responsibilities.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* User Access & Roles Section */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>User Access & Roles</CardTitle>
              <CardDescription>Select the access roles and permissions for this user.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="user_access"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Roles</FormLabel>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {userAccessRoles.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={role}
                            checked={field.value?.includes(role)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const newValue = checked
                                ? [...field.value, role]
                                : field.value.filter((r: string) => r !== role);
                              field.onChange(newValue);
                            }}
                            className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                          />
                          <label
                            htmlFor={role}
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {role}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Account Security Section */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Set up the user&rsquo;s login credentials and account status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormDescription>Must be at least 8 characters long.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>Enable or disable the user&rsquo;s account access.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Link href="/dashboard/users">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>Creating...</>
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
