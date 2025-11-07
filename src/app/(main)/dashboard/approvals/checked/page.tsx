"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { FileCheck, Eye } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

interface CheckedRequest {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  initiator: string;
  checkedBy: string;
  checkedDate: string;
  submittedDate: string;
}

const mockCheckedRequests: CheckedRequest[] = [
  {
    id: "3",
    requestNumber: "REQ-2024-003",
    itemName: "Printers",
    quantity: 2,
    department: "Finance",
    initiator: "Mike Johnson",
    checkedBy: "Sarah Checker",
    checkedDate: "2024-01-26",
    submittedDate: "2024-01-24",
  },
  {
    id: "4",
    requestNumber: "REQ-2024-007",
    itemName: "External Hard Drives",
    quantity: 5,
    department: "IT Department",
    initiator: "James Wilson",
    checkedBy: "Sarah Checker",
    checkedDate: "2024-01-27",
    submittedDate: "2024-01-25",
  },
];

export default function CheckedRequestsPage() {
  const router = useRouter();
  const [data] = useState<CheckedRequest[]>(mockCheckedRequests);

  const columns: ColumnDef<CheckedRequest>[] = [
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
      accessorKey: "checkedBy",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Checked By" />,
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {row.getValue("checkedBy")}
        </Badge>
      ),
    },
    {
      accessorKey: "checkedDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Checked On" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("checkedDate"));
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
    data,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Checked Requests</h1>
          <p className="text-muted-foreground text-sm">Requests verified by checker, ready for director review</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Checked</CardTitle>
            <FileCheck className="size-8 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Ready for review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Checked Requests</CardTitle>
          <CardDescription>Requests that have been verified and are ready for director review</CardDescription>
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
