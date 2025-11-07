"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Receipt, Eye, CheckCircle, AlertCircle, Download } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface PendingPayment {
  id: string;
  poNumber: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  vendorName: string;
  totalAmount: number;
  department: string;
  procuredDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  daysWaiting: number;
}

const mockPendingPayments: PendingPayment[] = [
  {
    id: "1",
    poNumber: "PO-2024-001",
    requestNumber: "REQ-2024-003",
    itemName: "Desktop Computers",
    quantity: 3,
    vendorName: "TechHub Nigeria",
    totalAmount: 450000,
    department: "IT Department",
    procuredDate: "2024-01-28",
    priority: "HIGH",
    daysWaiting: 3,
  },
  {
    id: "2",
    poNumber: "PO-2024-002",
    requestNumber: "REQ-2024-007",
    itemName: "Office Chairs",
    quantity: 10,
    vendorName: "Office Essentials Ltd",
    totalAmount: 250000,
    department: "Administration",
    procuredDate: "2024-01-27",
    priority: "MEDIUM",
    daysWaiting: 4,
  },
  {
    id: "3",
    poNumber: "PO-2024-005",
    requestNumber: "REQ-2024-012",
    itemName: "Printers",
    quantity: 2,
    vendorName: "Prime Suppliers",
    totalAmount: 180000,
    department: "Finance",
    procuredDate: "2024-01-25",
    priority: "MEDIUM",
    daysWaiting: 6,
  },
];

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  MEDIUM: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function PendingPaymentsPage() {
  const router = useRouter();
  const [data, setData] = useState<PendingPayment[]>(mockPendingPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredData = data.filter((payment) => {
    const matchesPriority = priorityFilter === "all" || payment.priority === priorityFilter;
    const matchesSearch =
      searchQuery === "" ||
      payment.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const handleProcessPayment = async (id: string, poNumber: string) => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setData(data.filter((payment) => payment.id !== id));

      toast.success("Payment processed successfully!", {
        description: `${poNumber} has been marked as paid and moved to processed payments.`,
      });
    } catch (error) {
      toast.error("Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const columns: ColumnDef<PendingPayment>[] = [
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
            {days > 5 && <AlertCircle className="size-4 text-red-500" />}
            <span className={days > 5 ? "font-medium text-red-600" : ""}>{days} days</span>
          </div>
        );
      },
    },
    {
      accessorKey: "procuredDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Procured Date" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("procuredDate"));
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
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/dashboard/finance/pending/${row.original.id}`)}
          >
            <Eye className="size-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" disabled={isProcessing}>
                <CheckCircle className="mr-2 size-4" />
                Process Payment
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Process Payment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to process payment for {row.original.poNumber}? This will mark it as paid and
                  move it to processed payments.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleProcessPayment(row.original.id, row.original.poNumber)}>
                  Process Payment
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  const table = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id,
  });

  const totalPendingAmount = data.reduce((sum, payment) => sum + payment.totalAmount, 0);

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pending Payments</h1>
          <p className="text-muted-foreground text-sm">Process payments for procured items</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Receipt className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <Receipt className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalPendingAmount.toLocaleString()}</div>
            <p className="text-muted-foreground mt-1 text-xs">To be paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((p) => p.priority === "HIGH").length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Urgent payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((p) => p.daysWaiting > 5).length}</div>
            <p className="text-muted-foreground mt-1 text-xs">More than 5 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Payment Requests</CardTitle>
          <CardDescription>Process payments for successfully procured items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by PO, Request ID, Vendor, or Item..."
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
