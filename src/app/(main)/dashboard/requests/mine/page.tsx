"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Request, RequestStatus } from "@/types/tableColumns";
import { mockRequests } from "../_components/mockdata";
import { mineColumns } from "../_components/all-request.column";

// Mock data

export default function MyRequestsPage() {
  const router = useRouter();
  const [data] = useState<Request[]>(mockRequests);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(
    () =>
      data.filter((request) => {
        const matchesStatus = statusFilter === "all" || request.status === statusFilter;
        const matchesSearch =
          searchQuery === "" ||
          request.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.itemName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      }),
    [data, statusFilter, searchQuery],
  );

  const columns = useMemo(() => mineColumns(router), [router]);

  const table = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight_ text-2xl font-semibold">My Requests</h1>
          <p className="text-muted-foreground text-sm">View and track all your submitted requests.</p>
        </div>
        <Button onClick={() => router.push("/dashboard/requests/new")}>
          <Plus />
          New Request
        </Button>
      </div>

      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Request History</CardTitle>
              <CardDescription>A complete list of all your submitted requests.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by request ID or item name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CHECKED">Checked</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="IN_PROCUREMENT">In Procurement</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
              </SelectContent>
            </Select>
            <DataTableViewOptions table={table} />
          </div>

          <div className="overflow-hidden rounded-lg border">
            <DataTable table={table} columns={columns} />
          </div>

          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
