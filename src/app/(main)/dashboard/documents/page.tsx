"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, Upload, FileText, Image, File, TrendingUp, Eye, Download } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CategoryStats {
  category: string;
  count: number;
  size: number;
  icon: React.ReactNode;
}

interface RecentDocument {
  id: string;
  title: string;
  category: string;
  uploadedBy: string;
  uploadedDate: string;
  fileType: string;
}

const mockCategoryStats: CategoryStats[] = [
  {
    category: "Request Documents",
    count: 12,
    size: 15600,
    icon: <FileText className="size-5 text-blue-500" />,
  },
  {
    category: "Purchase Orders",
    count: 8,
    size: 9800,
    icon: <File className="size-5 text-green-500" />,
  },
  {
    category: "Invoices",
    count: 10,
    size: 12400,
    icon: <FileText className="size-5 text-red-500" />,
  },
  {
    category: "Receipts",
    count: 15,
    size: 6750,
    icon: <File className="size-5 text-purple-500" />,
  },
  {
    category: "Budget Documents",
    count: 5,
    size: 18200,
    icon: <FileText className="size-5 text-orange-500" />,
  },
];

const mockRecentDocuments: RecentDocument[] = [
  {
    id: "1",
    title: "Technical Specifications",
    category: "Request Documents",
    uploadedBy: "Easy Gee",
    uploadedDate: "2024-01-25",
    fileType: "PDF",
  },
  {
    id: "2",
    title: "Purchase Order - Office Chairs",
    category: "Purchase Orders",
    uploadedBy: "John Procurement",
    uploadedDate: "2024-01-24",
    fileType: "PDF",
  },
  {
    id: "3",
    title: "Invoice - TechHub Nigeria",
    category: "Invoices",
    uploadedBy: "Sarah Admin",
    uploadedDate: "2024-01-23",
    fileType: "PDF",
  },
  {
    id: "4",
    title: "Payment Receipt",
    category: "Receipts",
    uploadedBy: "John Finance",
    uploadedDate: "2024-01-22",
    fileType: "PDF",
  },
];

export default function DocumentsMainPage() {
  const router = useRouter();
  const [categoryStats] = useState<CategoryStats[]>(mockCategoryStats);
  const [recentDocuments] = useState<RecentDocument[]>(mockRecentDocuments);

  const totalDocuments = categoryStats.reduce((sum, cat) => sum + cat.count, 0);
  const totalSize = categoryStats.reduce((sum, cat) => sum + cat.size, 0);
  const storageLimit = 100 * 1024; // 100 MB
  const storagePercentage = Math.round((totalSize / storageLimit) * 100);

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Document Management</h1>
          <p className="text-muted-foreground text-sm">Organize and manage all your documents</p>
        </div>
        <Button onClick={() => router.push("/dashboard/documents/upload")}>
          <Upload className="mr-2" />
          Upload Documents
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FolderOpen className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-muted-foreground mt-1 text-xs">All files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <TrendingUp className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalSize / 1024).toFixed(1)} MB</div>
            <p className="text-muted-foreground mt-1 text-xs">{storagePercentage}% of limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <File className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryStats.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Document types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Upload</CardTitle>
            <Upload className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">Today</div>
            <p className="text-muted-foreground mt-1 text-xs">Last activity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Documents by Category</CardTitle>
              <CardDescription>Breakdown of documents across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {category.icon}
                        <div>
                          <p className="text-sm font-medium">{category.category}</p>
                          <p className="text-muted-foreground text-xs">{(category.size / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Badge variant="outline">{category.count} files</Badge>
                    </div>
                    <Progress value={(category.count / totalDocuments) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Recently uploaded or modified files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="hover:bg-accent flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors"
                    onClick={() => router.push(`/dashboard/documents/${doc.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-muted flex size-10 items-center justify-center rounded">
                        <FileText className="text-muted-foreground size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doc.title}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="text-xs">
                            {doc.category}
                          </Badge>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{doc.uploadedBy}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {new Date(doc.uploadedDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Eye className="text-muted-foreground size-4" />
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => router.push("/dashboard/documents/manage")}
              >
                View All Documents
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
              <CardDescription>Track your document storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used Storage</span>
                  <span className="font-medium">{storagePercentage}%</span>
                </div>
                <Progress value={storagePercentage} className="h-2" />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{(totalSize / 1024).toFixed(2)} MB used</span>
                  <span className="text-muted-foreground">
                    {((storageLimit - totalSize) / 1024).toFixed(2)} MB free
                  </span>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">Storage Limit</p>
                <p className="mt-1 text-lg font-semibold">{storageLimit / 1024} MB</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common document tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push("/dashboard/documents/upload")}
              >
                <Upload className="mr-2 size-4" />
                Upload New Document
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => router.push("/dashboard/documents/manage")}
              >
                <FolderOpen className="mr-2 size-4" />
                Manage Documents
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="mr-2 size-4" />
                Bulk Download
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p className="text-muted-foreground">• Use descriptive titles for easy searching</p>
              <p className="text-muted-foreground">• Add relevant tags to organize documents</p>
              <p className="text-muted-foreground">• Link documents to related requests or POs</p>
              <p className="text-muted-foreground">• Version control automatically tracks changes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
