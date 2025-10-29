"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Eye, Download, Plus, Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

type RequestStatus =
  | "PENDING"
  | "CHECKED"
  | "REVIEWED"
  | "APPROVED"
  | "IN_PROCUREMENT"
  | "PROCURED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "REJECTED"
  | "RETURNED";

interface Request {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  status: RequestStatus;
  dateSubmitted: string;
  lastUpdated: string;
}

const statusColors: Record<RequestStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CHECKED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  REVIEWED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  IN_PROCUREMENT: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  PROCURED: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  PAYMENT_PENDING: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  RETURNED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const statusLabels: Record<RequestStatus, string> = {
  PENDING: "Pending",
  CHECKED: "Checked",
  REVIEWED: "Reviewed",
  APPROVED: "Approved",
  IN_PROCUREMENT: "In Procurement",
  PROCURED: "Procured",
  PAYMENT_PENDING: "Payment Pending",
  PAID: "Paid",
  REJECTED: "Rejected",
  RETURNED: "Returned",
};

// Mock data
const mockRequests: Request[] = [
  {
    id: "1",
    requestNumber: "REQ-2024-001",
    itemName: "Desktop Computer",
    quantity: 3,
    department: "IT Department",
    status: "APPROVED",
    dateSubmitted: "2024-01-15",
    lastUpdated: "2024-01-20",
  },
  {
    id: "2",
    requestNumber: "REQ-2024-002",
    itemName: "Office Chairs",
    quantity: 10,
    department: "Administration",
    status: "IN_PROCUREMENT",
    dateSubmitted: "2024-01-18",
    lastUpdated: "2024-01-22",
  },
  {
    id: "3",
    requestNumber: "REQ-2024-003",
    itemName: "Printer",
    quantity: 2,
    department: "Finance",
    status: "CHECKED",
    dateSubmitted: "2024-01-20",
    lastUpdated: "2024-01-21",
  },
  {
    id: "4",
    requestNumber: "REQ-2024-004",
    itemName: "Projector",
    quantity: 1,
    department: "Operations",
    status: "PENDING",
    dateSubmitted: "2024-01-22",
    lastUpdated: "2024-01-22",
  },
  {
    id: "5",
    requestNumber: "REQ-2024-005",
    itemName: "Laptops",
    quantity: 5,
    department: "IT Department",
    status: "PAID",
    dateSubmitted: "2024-01-10",
    lastUpdated: "2024-01-25",
  },
];

export default function MyRequestsPage() {
  const router = useRouter();
  const [data] = useState<Request[]>(mockRequests);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const columns: ColumnDef<Request>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "requestNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Request ID" />,
      cell: ({ row }) => <div className="font-medium tabular-nums">{row.getValue("requestNumber")}</div>,
    },
    {
      accessorKey: "itemName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Item" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("itemName")}</div>,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
      cell: ({ row }) => <div className="tabular-nums">{row.getValue("quantity")}</div>,
    },
    {
      accessorKey: "department",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
      cell: ({ row }) => <div>{row.getValue("department")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as RequestStatus;
        return (
          <Badge variant="outline" className={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "dateSubmitted",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date Submitted" />,
      cell: ({ row }) => (
        <div className="text-muted-foreground tabular-nums">
          {new Date(row.getValue("dateSubmitted")).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-muted-foreground flex size-8" size="icon">
              <EllipsisVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/requests/${row.original.id}`)}>
              <Eye />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download />
              Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
    },
  ];

  const filteredData = data.filter((request) => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      request.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const table = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Requests</h1>
          <p className="text-muted-foreground text-sm">View and track all your submitted requests.</p>
        </div>
        <Button onClick={() => router.push("/dashboard/requests/new")}>
          <Plus />
          New Request
        </Button>
      </div>

      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Request History</CardTitle>
              <CardDescription>A complete list of all your submitted requests.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by request ID or item name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CHECKED">Checked</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="IN_PROCUREMENT">In Procurement</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
              </SelectContent>
            </Select>
            <DataTableViewOptions table={table} />
          </div>

          <div className="overflow-hidden rounded-lg border">
            <DataTable table={table} columns={columns} />
          </div>

          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
