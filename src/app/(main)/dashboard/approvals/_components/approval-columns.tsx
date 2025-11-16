"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ApprovalRequest, RequestStatus } from "@/types/tableColumns";
import { statusColors } from "@/config/app-config";

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  MEDIUM: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  HIGH: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const createApprovalColumns = (router: any, showActions: boolean = true): ColumnDef<ApprovalRequest>[] => [
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
    accessorKey: "submittedDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Submitted" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("submittedDate"));
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
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as RequestStatus;
      return (
        <Badge variant="outline" className={statusColors[status]}>
          {status}
        </Badge>
      );
    },
  },
  ...(showActions
    ? [
        {
          id: "actions",
          cell: ({ row }: { row: any }) => (
            <Button size="sm" onClick={() => router.push(`/dashboard/approvals/${row.original.id}`)}>
              <Eye className="mr-2" />
              Review
            </Button>
          ),
        } as ColumnDef<ApprovalRequest>,
      ]
    : []),
];
