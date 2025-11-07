"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardCheck, Eye, Clock, FileCheck, UserCheck, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

type RequestStatus = "PENDING" | "CHECKED" | "REVIEWED" | "APPROVED" | "REJECTED";

interface ApprovalRequest {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  initiator: string;
  status: RequestStatus;
  submittedDate: string;
  currentStage: "CHECKER" | "REVIEWER" | "APPROVER";
  priority: "LOW" | "MEDIUM" | "HIGH";
}

// Mock Data
const mockPendingRequests: ApprovalRequest[] = [
  {
    id: "1",
    requestNumber: "REQ-2024-001",
    itemName: "Desktop Computers",
    quantity: 3,
    department: "IT Department",
    initiator: "Easy Gee",
    status: "PENDING",
    submittedDate: "2024-01-25",
    currentStage: "CHECKER",
    priority: "HIGH",
  },
  {
    id: "2",
    requestNumber: "REQ-2024-002",
    itemName: "Office Chairs",
    quantity: 10,
    department: "Administration",
    initiator: "Oluwasusi Stephen",
    status: "PENDING",
    submittedDate: "2024-01-26",
    currentStage: "CHECKER",
    priority: "MEDIUM",
  },
];

const mockCheckedRequests: ApprovalRequest[] = [
  {
    id: "3",
    requestNumber: "REQ-2024-003",
    itemName: "Printers",
    quantity: 2,
    department: "Finance",
    initiator: "Mike Johnson",
    status: "CHECKED",
    submittedDate: "2024-01-24",
    currentStage: "REVIEWER",
    priority: "MEDIUM",
  },
];

const mockReviewedRequests: ApprovalRequest[] = [
  {
    id: "4",
    requestNumber: "REQ-2024-004",
    itemName: "Laptops",
    quantity: 5,
    department: "Operations",
    initiator: "Sarah Williams",
    status: "REVIEWED",
    submittedDate: "2024-01-23",
    currentStage: "APPROVER",
    priority: "HIGH",
  },
];

const mockApprovedRequests: ApprovalRequest[] = [
  {
    id: "5",
    requestNumber: "REQ-2024-005",
    itemName: "Projectors",
    quantity: 1,
    department: "Training",
    initiator: "David Brown",
    status: "APPROVED",
    submittedDate: "2024-01-20",
    currentStage: "APPROVER",
    priority: "LOW",
  },
];

const statusColors: Record<RequestStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CHECKED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  REVIEWED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  MEDIUM: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function ApprovalsPage() {
  const router = useRouter();
  const [pendingRequests] = useState<ApprovalRequest[]>(mockPendingRequests);
  const [checkedRequests] = useState<ApprovalRequest[]>(mockCheckedRequests);
  const [reviewedRequests] = useState<ApprovalRequest[]>(mockReviewedRequests);
  const [approvedRequests] = useState<ApprovalRequest[]>(mockApprovedRequests);

  const createColumns = (showActions: boolean = true): ColumnDef<ApprovalRequest>[] => [
    {
      accessorKey: "requestNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Request ID" />,
      cell: ({ row }) => <div className="font-mono font-medium">{row.getValue("requestNumber")}</div>,
    },
    {
      accessorKey: "itemName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Item" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("itemName")}</div>,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Qty" />,
      cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
    },
    {
      accessorKey: "department",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
    },
    {
      accessorKey: "initiator",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Initiator" />,
    },
    {
      accessorKey: "priority",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
      cell: ({ row }) => {
        const priority = row.getValue("priority") as keyof typeof priorityColors;
        return (
          <Badge variant="outline" className={priorityColors[priority]}>
            {priority}
          </Badge>
        );
      },
    },
    {
      accessorKey: "submittedDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Submitted" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("submittedDate"));
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
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as RequestStatus;
        return (
          <Badge variant="outline" className={statusColors[status]}>
            {status}
          </Badge>
        );
      },
    },
    ...(showActions
      ? [
          {
            id: "actions",
            cell: ({ row }: { row: any }) => (
              <Button size="sm" onClick={() => router.push(`/dashboard/approvals/${row.original.id}`)}>
                <Eye className="mr-2" />
                Review
              </Button>
            ),
          } as ColumnDef<ApprovalRequest>,
        ]
      : []),
  ];

  const pendingTable = useDataTableInstance({
    data: pendingRequests,
    columns: createColumns(),
    getRowId: (row) => row.id,
  });

  const checkedTable = useDataTableInstance({
    data: checkedRequests,
    columns: createColumns(),
    getRowId: (row) => row.id,
  });

  const reviewedTable = useDataTableInstance({
    data: reviewedRequests,
    columns: createColumns(),
    getRowId: (row) => row.id,
  });

  const approvedTable = useDataTableInstance({
    data: approvedRequests,
    columns: createColumns(false),
    getRowId: (row) => row.id,
  });

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Approvals Overview</h1>
          <p className="text-muted-foreground text-sm">Manage and track all approval workflows</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Awaiting checker review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Checked</CardTitle>
            <FileCheck className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedRequests.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Ready for director review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <UserCheck className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewedRequests.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Awaiting DG approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <ShieldCheck className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Sent to procurement</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className="hover:bg-accent cursor-pointer transition-colors"
          onClick={() => router.push("/dashboard/approvals/pending")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-yellow-500" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Review and approve requests awaiting your action</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:bg-accent cursor-pointer transition-colors"
          onClick={() => router.push("/dashboard/approvals/checked")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="size-5 text-blue-500" />
              Checked Requests
            </CardTitle>
            <CardDescription>Requests verified by checker, ready for review</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:bg-accent cursor-pointer transition-colors"
          onClick={() => router.push("/dashboard/approvals/reviewed")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="size-5 text-purple-500" />
              Reviewed Requests
            </CardTitle>
            <CardDescription>Director-reviewed requests awaiting final approval</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Review ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="checked">Checked ({checkedRequests.length})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed ({reviewedRequests.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Requests awaiting initial checker review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <DataTable table={pendingTable} columns={createColumns()} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checked" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Checked Requests</CardTitle>
              <CardDescription>Verified requests ready for director review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <DataTable table={checkedTable} columns={createColumns()} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviewed Requests</CardTitle>
              <CardDescription>Director-reviewed requests awaiting DG approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <DataTable table={reviewedTable} columns={createColumns()} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Requests</CardTitle>
              <CardDescription>DG-approved requests sent to procurement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <DataTable table={approvedTable} columns={createColumns(false)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
