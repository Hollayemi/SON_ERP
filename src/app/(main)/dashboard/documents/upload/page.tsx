"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Upload, X, FileText, Image, File, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

const FormSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  relatedTo: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  tags: z.string().optional(),
});

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

const categories = [
  "Request Documents",
  "Purchase Orders",
  "Invoices",
  "Receipts",
  "Contracts",
  "Reports",
  "Budget Documents",
  "Payment Records",
  "Other",
];

export default function UploadDocumentsPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: "",
      relatedTo: "",
      title: "",
      description: "",
      tags: "",
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        return false;
      }
      return true;
    });

    const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "uploading",
    }));

    setFiles([...files, ...uploadedFiles]);

    // Simulate upload progress
    uploadedFiles.forEach((uploadedFile) => {
      simulateUpload(uploadedFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f)));

      if (progress >= 100) {
        clearInterval(interval);
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "completed" } : f)));
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setFiles(files.filter((f) => f.id !== fileId));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <Image className="size-5 text-blue-500" />;
    if (fileType.includes("pdf")) return <FileText className="size-5 text-red-500" />;
    return <File className="size-5 text-gray-500" />;
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (files.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    const incompleteFiles = files.filter((f) => f.status !== "completed");
    if (incompleteFiles.length > 0) {
      toast.error("Please wait for all files to finish uploading");
      return;
    }

    setIsUploading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Documents uploaded successfully!", {
        description: `${files.length} file(s) uploaded to ${data.category}`,
      });

      form.reset();
      setFiles([]);
      router.push("/dashboard/documents/manage");
    } catch (error) {
      toast.error("Failed to upload documents");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Upload Documents</h1>
          <p className="text-muted-foreground text-sm">Upload and organize your documents with metadata</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>Drag and drop files or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-border flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : ""
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                  <Upload className="text-muted-foreground size-8" />
                </div>
                <div className="mt-4 text-center">
                  <label htmlFor="file-upload" className="text-primary cursor-pointer font-medium hover:underline">
                    Click to upload
                  </label>
                  <span className="text-muted-foreground"> or drag and drop</span>
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (max. 10MB per file)
                </p>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept={ACCEPTED_FILE_TYPES.join(",")}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Uploaded Files ({files.length})</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFiles([])}
                      disabled={files.some((f) => f.status === "uploading")}
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {files.map((uploadedFile) => (
                      <div key={uploadedFile.id} className="bg-muted rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-1 items-center gap-3">
                            {getFileIcon(uploadedFile.file.type)}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{uploadedFile.file.name}</p>
                              <p className="text-muted-foreground text-xs">
                                {(uploadedFile.file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          {uploadedFile.status === "completed" ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="size-5 text-green-500" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => removeFile(uploadedFile.id)}
                              >
                                <X className="size-4" />
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="outline">Uploading...</Badge>
                          )}
                        </div>
                        {uploadedFile.status === "uploading" && (
                          <Progress value={uploadedFile.progress} className="mt-2 h-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
              <CardDescription>Add metadata for your documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
                    name="relatedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related To</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., REQ-2024-001" {...field} />
                        </FormControl>
                        <FormDescription>Request ID, PO Number, etc.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Document title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the document..."
                            className="min-h-20 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="urgent, approved, finance" {...field} />
                        </FormControl>
                        <FormDescription>Comma-separated tags</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isUploading || files.length === 0 || files.some((f) => f.status !== "completed")}
                    >
                      {isUploading ? "Uploading..." : "Upload Documents"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isUploading}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supported File Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <FileText className="size-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Documents</p>
                <p className="text-muted-foreground text-xs">PDF, DOC, DOCX</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <File className="size-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Spreadsheets</p>
                <p className="text-muted-foreground text-xs">XLS, XLSX</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Image className="size-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Images</p>
                <p className="text-muted-foreground text-xs">JPG, JPEG, PNG</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
