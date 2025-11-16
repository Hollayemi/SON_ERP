"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { UserCheck, Eye } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { mockReviewedData } from "../_components/mock_data";
import { ReviewedRequest } from "@/types/tableColumns";
import { reviewColums } from "../_components/reviewed-colums";

export default function ReviewedRequestsPage() {
  const router = useRouter();
  const [data] = useState<ReviewedRequest[]>(mockReviewedData);

  const columns = useMemo(() => reviewColums(router), [router]);

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
