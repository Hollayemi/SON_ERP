"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { CheckedRequest } from "@/types/tableColumns";

export const checkedColumns = (router: any): ColumnDef<CheckedRequest>[] => [
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
