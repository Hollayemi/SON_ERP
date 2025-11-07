"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ShieldCheck, Eye, ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApprovedRequest {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  initiator: string;
  approvedBy: string;
  approvedDate: string;
  procurementStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

const mockApprovedRequests: ApprovedRequest[] = [
  {
    id: "5",
    requestNumber: "REQ-2024-005",
    itemName: "Projectors",
    quantity: 1,
    department: "Training",
    initiator: "David Brown",
    approvedBy: "DG SON",
    approvedDate: "2024-01-26",
    procurementStatus: "IN_PROGRESS",
  },
  {
    id: "6",
    requestNumber: "REQ-2024-009",
    itemName: "Standing Desks",
    quantity: 8,
    department: "Administration",
    initiator: "Lisa Martinez",
    approvedBy: "DG SON",
    approvedDate: "2024-01-25",
    procurementStatus: "COMPLETED",
  },
  {
    id: "7",
    requestNumber: "REQ-2024-010",
    itemName: "Network Switches",
    quantity: 3,
    department: "IT Department",
    initiator: "Kevin Lee",
    approvedBy: "DG SON",
    approvedDate: "2024-01-27",
    procurementStatus: "PENDING",
  },
];

const procurementStatusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

export default function ApprovedRequestsPage() {
  const router = useRouter();
  const [data] = useState<ApprovedRequest[]>(mockApprovedRequests);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = data.filter((item) => {
    return statusFilter === "all" || item.procurementStatus === statusFilter;
  });

  const columns: ColumnDef<ApprovedRequest>[] = [
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
      accessorKey: "approvedBy",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Approved By" />,
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          {row.getValue("approvedBy")}
        </Badge>
      ),
    },
    {
      accessorKey: "approvedDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Approved On" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("approvedDate"));
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
      accessorKey: "procurementStatus",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Procurement" />,
      cell: ({ row }) => {
        const status = row.getValue("procurementStatus") as keyof typeof procurementStatusColors;
        return (
          <Badge variant="outline" className={procurementStatusColors[status]}>
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => router.push(`/dashboard/approvals/${row.original.id}`)}>
            <Eye className="size-4" />
          </Button>
          {row.original.procurementStatus === "PENDING" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/dashboard/procurement/order?requestId=${row.original.id}`)}
            >
              <ArrowRight className="mr-2 size-4" />
              Send to Procurement
            </Button>
          )}
        </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Approved Requests</h1>
          <p className="text-muted-foreground text-sm">DG-approved requests forwarded to procurement</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
            <ShieldCheck className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">By DG</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Procurement</CardTitle>
            <ShieldCheck className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((r) => r.procurementStatus === "PENDING").length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Awaiting sourcing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Procurement</CardTitle>
            <ShieldCheck className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((r) => r.procurementStatus === "IN_PROGRESS").length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Being sourced</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <ShieldCheck className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((r) => r.procurementStatus === "COMPLETED").length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Fully procured</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Approved Requests</CardTitle>
              <CardDescription>Requests approved by DG and forwarded to procurement</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending Procurement</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <DataTable table={table} columns={columns} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
