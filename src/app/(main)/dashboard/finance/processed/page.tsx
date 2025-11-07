"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Eye, Download, Receipt, TrendingUp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProcessedPayment {
  id: string;
  poNumber: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  vendorName: string;
  totalAmount: number;
  department: string;
  procuredDate: string;
  paidDate: string;
  processedBy: string;
  paymentMethod: "BANK_TRANSFER" | "CHEQUE" | "CASH";
  referenceNumber: string;
}

const mockProcessedPayments: ProcessedPayment[] = [
  {
    id: "1",
    poNumber: "PO-2024-003",
    requestNumber: "REQ-2024-009",
    itemName: "Laptops",
    quantity: 5,
    vendorName: "Tech Solutions Inc",
    totalAmount: 750000,
    department: "Operations",
    procuredDate: "2024-01-20",
    paidDate: "2024-01-25",
    processedBy: "Sarah Admin",
    paymentMethod: "BANK_TRANSFER",
    referenceNumber: "TRF-2024-001",
  },
  {
    id: "2",
    poNumber: "PO-2024-004",
    requestNumber: "REQ-2024-011",
    itemName: "Conference Room Equipment",
    quantity: 1,
    vendorName: "Office Essentials Ltd",
    totalAmount: 320000,
    department: "Administration",
    procuredDate: "2024-01-18",
    paidDate: "2024-01-24",
    processedBy: "John Finance",
    paymentMethod: "BANK_TRANSFER",
    referenceNumber: "TRF-2024-002",
  },
  {
    id: "3",
    poNumber: "PO-2023-045",
    requestNumber: "REQ-2023-120",
    itemName: "Network Switches",
    quantity: 3,
    vendorName: "TechHub Nigeria",
    totalAmount: 280000,
    department: "IT Department",
    procuredDate: "2023-12-28",
    paidDate: "2024-01-05",
    processedBy: "Sarah Admin",
    paymentMethod: "CHEQUE",
    referenceNumber: "CHQ-2024-001",
  },
  {
    id: "4",
    poNumber: "PO-2023-044",
    requestNumber: "REQ-2023-118",
    itemName: "Standing Desks",
    quantity: 8,
    vendorName: "Office Essentials Ltd",
    totalAmount: 400000,
    department: "Administration",
    procuredDate: "2023-12-22",
    paidDate: "2024-01-03",
    processedBy: "John Finance",
    paymentMethod: "BANK_TRANSFER",
    referenceNumber: "TRF-2023-089",
  },
  {
    id: "5",
    poNumber: "PO-2023-043",
    requestNumber: "REQ-2023-115",
    itemName: "Projectors",
    quantity: 2,
    vendorName: "Prime Suppliers",
    totalAmount: 170000,
    department: "Training",
    procuredDate: "2023-12-20",
    paidDate: "2023-12-28",
    processedBy: "Sarah Admin",
    paymentMethod: "BANK_TRANSFER",
    referenceNumber: "TRF-2023-087",
  },
];

const paymentMethodColors = {
  BANK_TRANSFER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  CHEQUE: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  CASH: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

export default function ProcessedPaymentsPage() {
  const router = useRouter();
  const [data] = useState<ProcessedPayment[]>(mockProcessedPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredData = data.filter((payment) => {
    const matchesDepartment = departmentFilter === "all" || payment.department === departmentFilter;
    const matchesMethod = methodFilter === "all" || payment.paymentMethod === methodFilter;
    const matchesSearch =
      searchQuery === "" ||
      payment.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesMethod && matchesSearch;
  });

  const columns: ColumnDef<ProcessedPayment>[] = [
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
      accessorKey: "paymentMethod",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Method" />,
      cell: ({ row }) => {
        const method = row.getValue("paymentMethod") as keyof typeof paymentMethodColors;
        return (
          <Badge variant="outline" className={paymentMethodColors[method]}>
            {method.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "referenceNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Reference" />,
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("referenceNumber")}</div>,
    },
    {
      accessorKey: "paidDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Paid Date" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("paidDate"));
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
      accessorKey: "processedBy",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Processed By" />,
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          {row.getValue("processedBy")}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/dashboard/finance/processed/${row.original.id}`)}
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
  const totalPaidAmount = data.reduce((sum, payment) => sum + payment.totalAmount, 0);

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Processed Payments</h1>
          <p className="text-muted-foreground text-sm">View all completed payment transactions</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
            <CheckCircle2 className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Completed payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Amount Paid</CardTitle>
            <TrendingUp className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalPaidAmount.toLocaleString()}</div>
            <p className="text-muted-foreground mt-1 text-xs">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bank Transfers</CardTitle>
            <Receipt className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((p) => p.paymentMethod === "BANK_TRANSFER").length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Electronic payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cheque Payments</CardTitle>
            <Receipt className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((p) => p.paymentMethod === "CHEQUE").length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Physical cheques</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Complete record of all processed payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by PO, Request ID, Vendor, Item, or Reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="CHEQUE">Cheque</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
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
