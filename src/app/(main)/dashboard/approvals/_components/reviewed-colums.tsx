"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { CheckedRequest, ReviewedRequest } from "@/types/tableColumns";

const recommendationColors = {
  APPROVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  NEEDS_DISCUSSION: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export const reviewColums = (router: any): ColumnDef<ReviewedRequest>[] => [
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
    accessorKey: "reviewedBy",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reviewed By" />,
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-purple-50 text-purple-700">
        {row.getValue("reviewedBy")}
      </Badge>
    ),
  },
  {
    accessorKey: "recommendation",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Recommendation" />,
    cell: ({ row }) => {
      const rec = row.getValue("recommendation") as keyof typeof recommendationColors;
      return (
        <Badge variant="outline" className={recommendationColors[rec]}>
          {rec.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reviewedDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reviewed On" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("reviewedDate"));
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
