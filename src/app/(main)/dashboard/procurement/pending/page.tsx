"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ShoppingCart, Eye, CheckCircle, Clock, Package } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { pendingColumns } from "../_component/pending.columns";

type ProcurementStatus = "PENDING" | "IN_PROGRESS" | "SOURCED" | "DELIVERED";

interface PendingRequest {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  approvedBy: string;
  approvedDate: string;
  status: ProcurementStatus;
  assignedTo?: string;
}

// Mock Data
const mockPendingRequests: PendingRequest[] = [
  {
    id: "1",
    requestNumber: "REQ-2024-001",
    itemName: "Desktop Computers",
    quantity: 3,
    department: "IT Department",
    approvedBy: "DG SON",
    approvedDate: "2024-01-25",
    status: "PENDING",
  },
  {
    id: "2",
    requestNumber: "REQ-2024-005",
    itemName: "Office Chairs",
    quantity: 10,
    department: "Administration",
    approvedBy: "DG SON",
    approvedDate: "2024-01-26",
    status: "IN_PROGRESS",
    assignedTo: "John Procurement",
  },
  {
    id: "3",
    requestNumber: "REQ-2024-008",
    itemName: "Printers",
    quantity: 2,
    department: "Finance",
    approvedBy: "DG SON",
    approvedDate: "2024-01-27",
    status: "SOURCED",
    assignedTo: "Mary Supplier",
  },
];

export default function PendingProcurementPage() {
  const router = useRouter();
  const [data] = useState<PendingRequest[]>(mockPendingRequests);

  const columns = useMemo(() => pendingColumns(router), [router]);

  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight_ text-2xl font-semibold">Pending Procurement</h1>
          <p className="text-muted-foreground text-sm">Manage and process approved requests awaiting procurement</p>
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
            <div className="text-2xl font-bold">{data.filter((r) => r.status === "PENDING").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <ShoppingCart className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((r) => r.status === "IN_PROGRESS").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sourced</CardTitle>
            <CheckCircle className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((r) => r.status === "SOURCED").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.reduce((sum, item) => sum + item.quantity, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Procurement Requests</CardTitle>
          <CardDescription>All approved requests awaiting sourcing and procurement</CardDescription>
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
