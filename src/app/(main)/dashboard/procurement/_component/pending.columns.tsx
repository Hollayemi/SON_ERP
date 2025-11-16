"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { PendingRequest, ProcurementStatus } from "@/types/tableColumns";
import { statusColors } from "@/config/app-config";

export const pendingColumns = (router: any): ColumnDef<PendingRequest>[] => [
  {
    accessorKey: "requestNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Request ID" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("requestNumber")}</div>,
  },
  {
    accessorKey: "itemName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Item" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("itemName")}</div>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "department",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
  },
  {
    accessorKey: "approvedDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Approved Date" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("approvedDate"));
      return (
        <div className="text-muted-foreground">
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
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as ProcurementStatus;
      return (
        <Badge variant="outline" className={statusColors[status]}>
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned To" />,
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo") as string | undefined;
      return assignedTo ? <span>{assignedTo}</span> : <span className="text-muted-foreground italic">Unassigned</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push(`/dashboard/procurement/requests/${row.original.id}`)}
        >
          <Eye className="mr-2" />
          View
        </Button>
        {row.original.status === "PENDING" && (
          <Button size="sm" onClick={() => router.push(`/dashboard/procurement/order?requestId=${row.original.id}`)}>
            <ShoppingCart className="mr-2" />
            Create PO
          </Button>
        )}
      </div>
    ),
  },
];
