"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  FolderOpen,
  Eye,
  Download,
  Trash2,
  FileText,
  Image,
  File,
  MoreVertical,
  Upload,
  Search,
  Filter,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  relatedTo?: string;
  uploadedBy: string;
  uploadedDate: string;
  version: number;
  tags: string[];
  description?: string;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Technical Specifications",
    fileName: "tech_specs_v2.pdf",
    fileType: "application/pdf",
    fileSize: 2450,
    category: "Request Documents",
    relatedTo: "REQ-2024-001",
    uploadedBy: "Easy Gee",
    uploadedDate: "2024-01-25",
    version: 2,
    tags: ["technical", "specifications"],
    description: "Technical specifications for desktop computers",
  },
  {
    id: "2",
    title: "Purchase Order - Office Chairs",
    fileName: "PO-2024-002.pdf",
    fileType: "application/pdf",
    fileSize: 1200,
    category: "Purchase Orders",
    relatedTo: "PO-2024-002",
    uploadedBy: "John Procurement",
    uploadedDate: "2024-01-24",
    version: 1,
    tags: ["purchase-order", "furniture"],
    description: "Purchase order for office chairs",
  },
  {
    id: "3",
    title: "Invoice - TechHub Nigeria",
    fileName: "invoice_techhub_jan.pdf",
    fileType: "application/pdf",
    fileSize: 890,
    category: "Invoices",
    relatedTo: "PO-2024-001",
    uploadedBy: "Sarah Admin",
    uploadedDate: "2024-01-23",
    version: 1,
    tags: ["invoice", "payment"],
  },
  {
    id: "4",
    title: "Payment Receipt",
    fileName: "receipt_TRF-2024-001.pdf",
    fileType: "application/pdf",
    fileSize: 450,
    category: "Receipts",
    relatedTo: "TRF-2024-001",
    uploadedBy: "John Finance",
    uploadedDate: "2024-01-22",
    version: 1,
    tags: ["receipt", "payment"],
  },
  {
    id: "5",
    title: "Budget Proposal Q1",
    fileName: "budget_q1_2024.xlsx",
    fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fileSize: 3200,
    category: "Budget Documents",
    uploadedBy: "Sarah Admin",
    uploadedDate: "2024-01-20",
    version: 3,
    tags: ["budget", "quarterly"],
    description: "Q1 2024 budget proposal and breakdown",
  },
];

const categories = [
  "All Categories",
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

export default function ManageDocumentsPage() {
  const router = useRouter();
  const [data, setData] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const filteredData = data.filter((doc) => {
    const matchesCategory = categoryFilter === "All Categories" || doc.category === categoryFilter;
    const matchesSearch =
      searchQuery === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.relatedTo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <Image className="size-4 text-blue-500" />;
    if (fileType.includes("pdf")) return <FileText className="size-4 text-red-500" />;
    if (fileType.includes("sheet") || fileType.includes("excel")) return <File className="size-4 text-green-500" />;
    return <File className="size-4 text-gray-500" />;
  };

  const handleDelete = (id: string) => {
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      setData(data.filter((doc) => doc.id !== documentToDelete));
      toast.success("Document deleted successfully");
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleDownload = (doc: Document) => {
    toast.success(`Downloading ${doc.fileName}`);
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/documents/${id}`);
  };

  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Document" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {getFileIcon(row.original.fileType)}
          <div>
            <div className="font-medium">{row.getValue("title")}</div>
            <div className="text-muted-foreground text-xs">{row.original.fileName}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "relatedTo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Related To" />,
      cell: ({ row }) => {
        const relatedTo = row.getValue("relatedTo") as string | undefined;
        return relatedTo ? (
          <div className="font-mono text-sm">{relatedTo}</div>
        ) : (
          <span className="text-muted-foreground italic">-</span>
        );
      },
    },
    {
      accessorKey: "fileSize",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Size" />,
      cell: ({ row }) => <div className="text-sm">{row.getValue("fileSize")} KB</div>,
    },
    {
      accessorKey: "version",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Version" />,
      cell: ({ row }) => <Badge variant="outline">v{row.getValue("version")}</Badge>,
    },
    {
      accessorKey: "uploadedBy",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Uploaded By" />,
      cell: ({ row }) => <div className="text-sm">{row.getValue("uploadedBy")}</div>,
    },
    {
      accessorKey: "uploadedDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("uploadedDate"));
        return (
          <div className="text-muted-foreground text-sm">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(row.original.id)}>
              <Eye className="mr-2 size-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload(row.original)}>
              <Download className="mr-2 size-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => handleDelete(row.original.id)}>
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id,
  });

  const totalSize = data.reduce((sum, doc) => sum + doc.fileSize, 0);

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Documents</h1>
          <p className="text-muted-foreground text-sm">View, download, and organize all your documents</p>
        </div>
        <Button onClick={() => router.push("/dashboard/documents/upload")}>
          <Upload className="mr-2" />
          Upload New
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FolderOpen className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">All files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <File className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalSize / 1024).toFixed(2)} MB</div>
            <p className="text-muted-foreground mt-1 text-xs">Storage used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Filter className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length - 1}</div>
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

      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>Browse and manage all uploaded documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
              <Input
                placeholder="Search by title, filename, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <DataTable table={table} columns={columns} />
          </div>

          <DataTablePagination table={table} />
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
