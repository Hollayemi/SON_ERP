"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Trash2,
  FileText,
  User,
  Calendar,
  Tag,
  FolderOpen,
  Upload,
  Eye,
  History,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentVersion {
  version: number;
  uploadedBy: string;
  uploadedDate: string;
  fileSize: number;
  changes: string;
}

interface DocumentDetail {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  relatedTo?: string;
  uploadedBy: string;
  uploadedDate: string;
  lastModified: string;
  currentVersion: number;
  tags: string[];
  description?: string;
  versions: DocumentVersion[];
}

const mockDocument: DocumentDetail = {
  id: "1",
  title: "Technical Specifications",
  fileName: "tech_specs_v2.pdf",
  fileType: "application/pdf",
  fileSize: 2450,
  category: "Request Documents",
  relatedTo: "REQ-2024-001",
  uploadedBy: "Easy Gee",
  uploadedDate: "2024-01-15",
  lastModified: "2024-01-25",
  currentVersion: 2,
  tags: ["technical", "specifications", "computers"],
  description:
    "Technical specifications for desktop computers procurement request. Includes detailed hardware requirements, software specifications, and vendor guidelines.",
  versions: [
    {
      version: 2,
      uploadedBy: "Easy Gee",
      uploadedDate: "2024-01-25",
      fileSize: 2450,
      changes: "Updated processor requirements and added network specifications",
    },
    {
      version: 1,
      uploadedBy: "Easy Gee",
      uploadedDate: "2024-01-15",
      fileSize: 2200,
      changes: "Initial document upload",
    },
  ],
};

export default function DocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [document] = useState<DocumentDetail>(mockDocument);

  const handleDownload = (version?: number) => {
    const versionText = version ? ` (v${version})` : "";
    toast.success(`Downloading ${document.fileName}${versionText}`);
  };

  const handleDelete = () => {
    toast.success("Document deleted successfully");
    router.push("/dashboard/documents/manage");
  };

  const handleUploadNewVersion = () => {
    toast.info("Upload new version functionality would be implemented here");
  };

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="tracking-tight_ text-2xl font-semibold">Document Details</h1>
          <p className="text-muted-foreground text-sm">View and manage document information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleDownload()}>
            <Download className="mr-2" />
            Download
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Trash2 className="mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Document</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{document.title}&quot;? This action cannot be undone and will
                  delete all versions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-5" />
                    {document.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <span className="font-mono">{document.fileName}</span>
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  v{document.currentVersion}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {document.description && (
                <>
                  <div>
                    <Label className="text-muted-foreground text-xs">Description</Label>
                    <p className="mt-2 text-sm leading-relaxed">{document.description}</p>
                  </div>
                  <Separator />
                </>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground text-xs">Category</Label>
                  <p className="mt-1 font-medium">{document.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">File Size</Label>
                  <p className="mt-1 font-medium">{document.fileSize} KB</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">File Type</Label>
                  <p className="mt-1 font-medium">PDF Document</p>
                </div>
                {document.relatedTo && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Related To</Label>
                    <p className="mt-1 font-mono font-medium">{document.relatedTo}</p>
                  </div>
                )}
              </div>

              {document.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground text-xs">Tags</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {document.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          <Tag className="mr-1 size-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="versions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="versions">Version History</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="versions">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <History className="size-5" />
                        Version History
                      </CardTitle>
                      <CardDescription>All versions of this document</CardDescription>
                    </div>
                    <Button size="sm" onClick={handleUploadNewVersion}>
                      <Upload className="mr-2 size-4" />
                      Upload New Version
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {document.versions.map((version, index) => (
                      <div key={version.version} className="border-muted border-l-2 pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">Version {version.version}</p>
                              {index === 0 && (
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">{version.changes}</p>
                            <div className="mt-2 flex items-center gap-4 text-xs">
                              <span className="text-muted-foreground">
                                <User className="mr-1 inline size-3" />
                                {version.uploadedBy}
                              </span>
                              <span className="text-muted-foreground">
                                <Calendar className="mr-1 inline size-3" />
                                {new Date(version.uploadedDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              <span className="text-muted-foreground">{version.fileSize} KB</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleDownload(version.version)}>
                              <Download className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent actions on this document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <Upload className="size-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New version uploaded</p>
                        <p className="text-muted-foreground text-xs">Version 2 uploaded by Easy Gee</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {new Date(document.lastModified).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                        <Eye className="size-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Document viewed</p>
                        <p className="text-muted-foreground text-xs">Viewed by John Procurement</p>
                        <p className="text-muted-foreground mt-1 text-xs">Jan 24, 2024, 3:45 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-100">
                        <Download className="size-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Document downloaded</p>
                        <p className="text-muted-foreground text-xs">Downloaded by Sarah Admin</p>
                        <p className="text-muted-foreground mt-1 text-xs">Jan 23, 2024, 10:20 AM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <Upload className="size-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Document created</p>
                        <p className="text-muted-foreground text-xs">Initial upload by Easy Gee</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {new Date(document.uploadedDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="size-5" />
                Document Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-xs">Uploaded By</Label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                    <User className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{document.uploadedBy}</p>
                    <p className="text-muted-foreground text-xs">Initiator</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-muted-foreground text-xs">Created</Label>
                <p className="mt-1 text-sm font-medium">
                  {new Date(document.uploadedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Last Modified</Label>
                <p className="mt-1 text-sm font-medium">
                  {new Date(document.lastModified).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Current Version</Label>
                <p className="mt-1 text-sm font-medium">Version {document.currentVersion}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => handleDownload()}>
                  <Download className="mr-2" />
                  Download Current
                </Button>
                <Button variant="outline" className="w-full" onClick={handleUploadNewVersion}>
                  <Upload className="mr-2" />
                  Upload New Version
                </Button>
              </div>

              <div className="text-muted-foreground space-y-1 rounded-lg border p-3 text-xs">
                <p>• All versions are preserved</p>
                <p>• Previous versions can be downloaded</p>
                <p>• Activity log tracks all changes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
