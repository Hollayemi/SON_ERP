"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Clock, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PendingRequest {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  initiator: string;
  submittedDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  daysWaiting: number;
}

// Mock Data
const mockPendingRequests: PendingRequest[] = [
  {
    id: "1",
    requestNumber: "REQ-2024-001",
    itemName: "Desktop Computers",
    quantity: 3,
    department: "IT Department",
    initiator: "Easy Gee",
    submittedDate: "2024-01-25",
    priority: "HIGH",
    daysWaiting: 2,
  },
  {
    id: "2",
    requestNumber: "REQ-2024-002",
    itemName: "Office Chairs",
    quantity: 10,
    department: "Administration",
    initiator: "Oluwasusi Stephen",
    submittedDate: "2024-01-26",
    priority: "MEDIUM",
    daysWaiting: 1,
  },
  {
    id: "3",
    requestNumber: "REQ-2024-006",
    itemName: "Whiteboard Markers",
    quantity: 50,
    department: "Training",
    initiator: "Mary Johnson",
    submittedDate: "2024-01-23",
    priority: "LOW",
    daysWaiting: 4,
  },
];

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  MEDIUM: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function PendingApprovalsPage() {
  const router = useRouter();
  const [data] = useState<PendingRequest[]>(mockPendingRequests);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((item) => {
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const columns: ColumnDef<PendingRequest>[] = [
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
      accessorKey: "daysWaiting",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Days Waiting" />,
      cell: ({ row }) => {
        const days = row.getValue("daysWaiting") as number;
        return (
          <div className="flex items-center gap-2">
            {days > 3 && <AlertTriangle className="size-4 text-yellow-500" />}
            <span className={days > 3 ? "font-medium text-yellow-600" : ""}>{days} days</span>
          </div>
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
      id: "actions",
      cell: ({ row }) => (
        <Button size="sm" onClick={() => router.push(`/dashboard/approvals/${row.original.id}`)}>
          <Eye className="mr-2" />
          Review
        </Button>
      ),
    },
  ];

  const table = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight_ text-2xl font-semibold">Pending Approvals</h1>
          <p className="text-muted-foreground text-sm">Review and process requests awaiting your approval</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Clock className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((r) => r.priority === "HIGH").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
            <Clock className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((r) => r.priority === "MEDIUM").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue ( 3 days)</CardTitle>
            <XCircle className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((r) => r.daysWaiting > 3).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>All requests awaiting checker approval</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by request ID, item, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="HIGH">High Priority</SelectItem>
                <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                <SelectItem value="LOW">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <DataTable table={table} columns={columns} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
