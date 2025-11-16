"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { CheckedRequest } from "@/types/tableColumns";
import { mockCheckedData } from "../_components/mock_data";
import { checkedColumns } from "../_components/checked-columns";

export default function CheckedRequestsPage() {
  const router = useRouter();
  const [data] = useState<CheckedRequest[]>(mockCheckedData);

  const columns = useMemo(() => checkedColumns(router), [router]);

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
