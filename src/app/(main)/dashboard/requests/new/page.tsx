"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

const FormSchema = z.object({
  itemName: z.string().min(3, { message: "Item name must be at least 3 characters." }),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }),
  department: z.string().min(1, { message: "Please select a department." }),
  purpose: z.string().min(10, { message: "Purpose must be at least 10 characters." }),
  justification: z.string().min(20, { message: "Justification must be at least 20 characters." }),
});

const departments = [
  "Administration",
  "Finance",
  "Human Resources",
  "IT Department",
  "Procurement",
  "Operations",
  "Quality Assurance",
  "Research & Development",
  "Legal",
  "Marketing",
];

export default function CreateNewRequestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      itemName: "",
      quantity: 1,
      department: "",
      purpose: "",
      justification: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Validate file size and type
      const validFiles = newFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} is too large. Maximum size is 5MB.`);
          return false;
        }
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
          toast.error(`${file.name} is not a supported file type.`);
          return false;
        }
        return true;
      });

      setFiles([...files, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would upload files and submit the form data
      console.log("Form data:", data);
      console.log("Files:", files);

      toast.success("Request submitted successfully!", {
        description: "Your request has been sent to the Checker for review.",
      });

      // Navigate to my requests page
      router.push("/dashboard/requests/mine");
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight_ text-2xl font-semibold">Create New Request</h1>
          <p className="text-muted-foreground text-sm">
            Submit a new request for items or services required by your department.
          </p>
        </div>
      </div>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>
            Please provide detailed information about your request. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="itemName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Desktop Computer, Office Chair" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity *</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the purpose of this request..."
                        className="min-h-20 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Briefly explain why this item is needed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="justification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Justification *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide detailed justification for this request..."
                        className="min-h-32 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed justification including how this will benefit the department and any urgency.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div>
                  <FormLabel>Supporting Documents</FormLabel>
                  <FormDescription>
                    Upload any supporting documents (PDF, Word, Images). Maximum file size: 5MB per file.
                  </FormDescription>
                </div>

                <div className="border-border rounded-lg border-2 border-dashed p-6">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                      <Upload className="size-6" />
                    </div>
                    <div className="text-center">
                      <label htmlFor="file-upload" className="text-primary cursor-pointer font-medium hover:underline">
                        Click to upload
                      </label>
                      <span className="text-muted-foreground"> or drag and drop</span>
                    </div>
                    <p className="text-muted-foreground text-xs">PDF, DOC, DOCX, JPG, PNG (max. 5MB each)</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Uploaded Files ({files.length})</p>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="bg-muted flex items-center justify-between rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <FileText className="text-muted-foreground size-5" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeFile(index)}>
                            <X className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="min-w-32">
                  {isLoading ? "Submitting..." : "Submit Request"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
