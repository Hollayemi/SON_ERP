"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Package, Eye, Download, Calendar, TrendingUp, CheckCircle2, Clock } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProcurementHistory {
  id: string;
  poNumber: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  vendorName: string;
  totalAmount: number;
  status: "DELIVERED" | "PENDING_DELIVERY" | "CANCELLED";
  orderedDate: string;
  deliveredDate?: string;
  department: string;
}

// Mock Data
const mockHistory: ProcurementHistory[] = [
  {
    id: "1",
    poNumber: "PO-2024-001",
    requestNumber: "REQ-2024-003",
    itemName: "Desktop Computers",
    quantity: 3,
    vendorName: "TechHub Nigeria",
    totalAmount: 450000,
    status: "DELIVERED",
    orderedDate: "2024-01-20",
    deliveredDate: "2024-01-28",
    department: "IT Department",
  },
  {
    id: "2",
    poNumber: "PO-2024-002",
    requestNumber: "REQ-2024-007",
    itemName: "Office Chairs",
    quantity: 10,
    vendorName: "Office Essentials Ltd",
    totalAmount: 250000,
    status: "PENDING_DELIVERY",
    orderedDate: "2024-01-22",
    department: "Administration",
  },
  {
    id: "3",
    poNumber: "PO-2023-045",
    requestNumber: "REQ-2023-120",
    itemName: "Printers",
    quantity: 2,
    vendorName: "Prime Suppliers",
    totalAmount: 180000,
    status: "DELIVERED",
    orderedDate: "2023-12-15",
    deliveredDate: "2023-12-28",
    department: "Finance",
  },
  {
    id: "4",
    poNumber: "PO-2023-044",
    requestNumber: "REQ-2023-118",
    itemName: "Laptops",
    quantity: 5,
    vendorName: "Tech Solutions Inc",
    totalAmount: 750000,
    status: "DELIVERED",
    orderedDate: "2023-12-10",
    deliveredDate: "2023-12-22",
    department: "IT Department",
  },
  {
    id: "5",
    poNumber: "PO-2023-043",
    requestNumber: "REQ-2023-115",
    itemName: "Projectors",
    quantity: 1,
    vendorName: "TechHub Nigeria",
    totalAmount: 85000,
    status: "CANCELLED",
    orderedDate: "2023-12-05",
    department: "Operations",
  },
];

const statusColors = {
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  PENDING_DELIVERY: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function ProcurementHistoryPage() {
  const router = useRouter();
  const [data] = useState<ProcurementHistory[]>(mockHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const filteredData = data.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || item.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const columns: ColumnDef<ProcurementHistory>[] = [
    {
      accessorKey: "poNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="PO Number" />,
      cell: ({ row }) => <div className="font-mono font-medium">{row.getValue("poNumber")}</div>,
    },
    {
      accessorKey: "requestNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Request ID" />,
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("requestNumber")}</div>,
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
      accessorKey: "vendorName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Vendor" />,
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      cell: ({ row }) => <div className="font-medium">₦{(row.getValue("totalAmount") as number).toLocaleString()}</div>,
    },
    {
      accessorKey: "department",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
      cell: ({ row }) => <Badge variant="outline">{row.getValue("department")}</Badge>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors;
        return (
          <Badge variant="outline" className={statusColors[status]}>
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "orderedDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Ordered Date" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("orderedDate"));
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
      accessorKey: "deliveredDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Delivered" />,
      cell: ({ row }) => {
        const date = row.getValue("deliveredDate") as string | undefined;
        if (!date) return <span className="text-muted-foreground italic">-</span>;
        return (
          <div className="text-muted-foreground text-sm">
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
            onClick={() => router.push(`/dashboard/procurement/history/${row.original.id}`)}
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

  const departments = ["all", ...new Set(data.map((item) => item.department))];

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Procurement History</h1>
          <p className="text-muted-foreground text-sm">Track all sourced items and delivery status</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Procurements</CardTitle>
            <Package className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle2 className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((item) => item.status === "DELIVERED").length}</div>
            <p className="text-muted-foreground text-xs">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Delivery</CardTitle>
            <Clock className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((item) => item.status === "PENDING_DELIVERY").length}</div>
            <p className="text-muted-foreground text-xs">Awaiting delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦
              {data
                .filter((item) => item.status === "DELIVERED")
                .reduce((sum, item) => sum + item.totalAmount, 0)
                .toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Delivered items only</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Procurement Records</CardTitle>
          <CardDescription>Complete history of all procurement activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by PO, Request ID, Item, or Vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="PENDING_DELIVERY">Pending Delivery</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
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
    </div>
  );
}
