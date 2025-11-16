"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ProcurementHistory } from "@/types/tableColumns";
import { statusColors } from "@/config/app-config";

export const historyColumns = (router: any): ColumnDef<ProcurementHistory>[] => [
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
