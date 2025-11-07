"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef, Column } from "@tanstack/react-table";
import { FileText, Eye, Download, Filter, Plus, Package, CheckCircle, Clock, XCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type POStatus = "DRAFT" | "SENT" | "CONFIRMED" | "DELIVERED" | "CANCELLED";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  requestId: string;
  vendorName: string;
  itemName: string;
  quantity: number;
  totalAmount: number;
  status: POStatus;
  createdDate: string;
  deliveryDate?: string;
  createdBy: string;
}

// Mock Data
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO-2024-001",
    requestId: "REQ-2024-003",
    vendorName: "TechHub Nigeria",
    itemName: "Desktop Computers",
    quantity: 3,
    totalAmount: 450000,
    status: "CONFIRMED",
    createdDate: "2024-01-20",
    deliveryDate: "2024-02-05",
    createdBy: "John Procurement",
  },
  {
    id: "2",
    poNumber: "PO-2024-002",
    requestId: "REQ-2024-007",
    vendorName: "Office Essentials Ltd",
    itemName: "Office Chairs",
    quantity: 10,
    totalAmount: 250000,
    status: "SENT",
    createdDate: "2024-01-22",
    deliveryDate: "2024-02-10",
    createdBy: "Mary Supplier",
  },
  {
    id: "3",
    poNumber: "PO-2024-003",
    requestId: "REQ-2024-009",
    vendorName: "Prime Suppliers",
    itemName: "Printers",
    quantity: 2,
    totalAmount: 180000,
    status: "DELIVERED",
    createdDate: "2024-01-18",
    deliveryDate: "2024-01-28",
    createdBy: "John Procurement",
  },
  {
    id: "4",
    poNumber: "PO-2024-004",
    requestId: "REQ-2024-012",
    vendorName: "Tech Solutions Inc",
    itemName: "Laptops",
    quantity: 5,
    totalAmount: 750000,
    status: "DRAFT",
    createdDate: "2024-01-25",
    createdBy: "Sarah Admin",
  },
];

const statusColors: Record<POStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  SENT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  CONFIRMED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [data] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredData = data.filter((po) => {
    if (statusFilter === "all") return true;
    return po.status === statusFilter;
  });

  const columns: ColumnDef<PurchaseOrder>[] = [
    {
      accessorKey: "poNumber",
      header: ({ column }: { column: Column<PurchaseOrder> }) => (
        <DataTableColumnHeader column={column} title="PO Number" />
      ),
      cell: ({ row }) => <div className="font-mono font-medium">{row.getValue("poNumber")}</div>,
    },
    {
      accessorKey: "requestId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Request ID" />,
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("requestId")}</div>,
    },
    {
      accessorKey: "vendorName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Vendor" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("vendorName")}</div>,
    },
    {
      accessorKey: "itemName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Item" />,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Qty" />,
      cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Amount" />,
      cell: ({ row }) => <div className="font-medium">₦{(row.getValue("totalAmount") as number).toLocaleString()}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as POStatus;
        return (
          <Badge variant="outline" className={statusColors[status]}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "deliveryDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Delivery Date" />,
      cell: ({ row }) => {
        const date = row.getValue("deliveryDate") as string | undefined;
        if (!date) return <span className="text-muted-foreground italic">Not set</span>;
        return (
          <div className="text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
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
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/dashboard/procurement/purchase-orders/${row.original.id}`)}
          >
            <Eye className="size-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Download className="size-4" />
          </Button>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Purchase Orders</h1>
          <p className="text-muted-foreground text-sm">Manage and track all purchase orders</p>
        </div>
        <Button onClick={() => router.push("/dashboard/procurement/order")}>
          <Plus className="mr-2" />
          Create PO
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total POs</CardTitle>
            <FileText className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter((po) => po.status === "SENT" || po.status === "DRAFT").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((po) => po.status === "DELIVERED").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{data.reduce((sum, po) => sum + po.totalAmount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Purchase Orders</CardTitle>
              <CardDescription>Complete list of generated purchase orders</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
