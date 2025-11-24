"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockApprovedRequests } from "../_components/mock_data";
import { createApprovedColumns } from "../_components/approved-columns";
import { ApprovedRequest } from "@/types/tableColumns";

export default function ApprovedRequestsPage() {
  const router = useRouter();
  const [data] = useState<ApprovedRequest[]>(mockApprovedRequests);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(
    () => data.filter((item) => statusFilter === "all" || item.procurementStatus === statusFilter),
    [data, statusFilter],
  );

  const cardCounts = useMemo(
    () => ({
      pending: data.filter((r) => r.procurementStatus === "PENDING").length,
      inProgress: data.filter((r) => r.procurementStatus === "IN_PROGRESS").length,
      completed: data.filter((r) => r.procurementStatus === "COMPLETED").length,
    }),
    [data],
  );

  const columns = useMemo(() => createApprovedColumns(router), [router]);

  const table = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="@container/main flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight_ text-2xl font-semibold">Approved Requests</h1>
          <p className="text-muted-foreground text-sm">DG-approved requests forwarded to procurement</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
            <ShieldCheck className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">By DG</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Procurement</CardTitle>
            <ShieldCheck className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cardCounts.pending}</div>
            <p className="text-muted-foreground mt-1 text-xs">Awaiting sourcing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Procurement</CardTitle>
            <ShieldCheck className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cardCounts.inProgress}</div>
            <p className="text-muted-foreground mt-1 text-xs">Being sourced</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <ShieldCheck className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cardCounts.completed}</div>
            <p className="text-muted-foreground mt-1 text-xs">Fully procured</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Approved Requests</CardTitle>
              <CardDescription>Requests approved by DG and forwarded to procurement</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending Procurement</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
