"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { UserCheck, Eye } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

interface ReviewedRequest {
  id: string;
  requestNumber: string;
  itemName: string;
  quantity: number;
  department: string;
  initiator: string;
  reviewedBy: string;
  reviewedDate: string;
  recommendation: "APPROVE" | "NEEDS_DISCUSSION";
}

const mockReviewedRequests: ReviewedRequest[] = [
  {
    id: "4",
    requestNumber: "REQ-2024-004",
    itemName: "Laptops",
    quantity: 5,
    department: "Operations",
    initiator: "Sarah Williams",
    reviewedBy: "Director Stephen",
    reviewedDate: "2024-01-27",
    recommendation: "APPROVE",
  },
  {
    id: "5",
    requestNumber: "REQ-2024-008",
    itemName: "Conference Room Equipment",
    quantity: 1,
    department: "Administration",
    initiator: "Tom Anderson",
    reviewedBy: "Director Johnson",
    reviewedDate: "2024-01-26",
    recommendation: "APPROVE",
  },
];

const recommendationColors = {
  APPROVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  NEEDS_DISCUSSION: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export default function ReviewedRequestsPage() {
  const router = useRouter();
  const [data] = useState<ReviewedRequest[]>(mockReviewedRequests);

  const columns: ColumnDef<ReviewedRequest>[] = [
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

  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reviewed Requests</h1>
          <p className="text-muted-foreground text-sm">Director-reviewed requests awaiting final DG approval</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reviewed</CardTitle>
            <UserCheck className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Awaiting DG approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recommended</CardTitle>
            <UserCheck className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((r) => r.recommendation === "APPROVE").length}</div>
            <p className="text-muted-foreground mt-1 text-xs">For approval</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reviewed Requests</CardTitle>
          <CardDescription>Requests reviewed by directors, awaiting final approval from DG</CardDescription>
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
