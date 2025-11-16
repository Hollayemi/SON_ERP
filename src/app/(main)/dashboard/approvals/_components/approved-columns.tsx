"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ApprovedRequest } from "@/types/tableColumns";

const procurementStatusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

export const createApprovedColumns = (router: any): ColumnDef<ApprovedRequest>[] => [
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
