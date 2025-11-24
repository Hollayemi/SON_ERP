"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Clock, FileCheck, UserCheck, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { ApprovalRequest } from "@/types/tableColumns";
import {
  mockApprovalRequests,
  mockCheckedRequests,
  mockPendingRequests,
  mockReviewedRequests,
} from "./_components/mock_data";
import { createApprovalColumns } from "./_components/approval-columns";

export default function ApprovalsPage() {
  const router = useRouter();

  // Memoize the mock data arrays
  const mockData = useMemo(
    () => ({
      pending: mockPendingRequests,
      checked: mockCheckedRequests,
      reviewed: mockReviewedRequests,
      approved: mockApprovalRequests,
    }),
    [],
  );

  const [pendingRequests] = useState<ApprovalRequest[]>(mockData.pending);
  const [checkedRequests] = useState<ApprovalRequest[]>(mockData.checked);
  const [reviewedRequests] = useState<ApprovalRequest[]>(mockData.reviewed);
  const [approvedRequests] = useState<ApprovalRequest[]>(mockData.approved);

  // Memoize the columns to prevent unnecessary re-renders
  const approvalColumns = useMemo(() => createApprovalColumns(router), [router]);

  const approvalColumnsWithoutActions = useMemo(() => createApprovalColumns(router, false), [router]);

  // Memoize table instances
  const pendingTable = useDataTableInstance({
    data: pendingRequests,
    columns: approvalColumns,
    getRowId: (row) => row.id,
  });

  const checkedTable = useDataTableInstance({
    data: checkedRequests,
    columns: approvalColumns,
    getRowId: (row) => row.id,
  });

  const reviewedTable = useDataTableInstance({
    data: reviewedRequests,
    columns: approvalColumns,
    getRowId: (row) => row.id,
  });

  const approvedTable = useDataTableInstance({
    data: approvedRequests,
    columns: approvalColumnsWithoutActions,
    getRowId: (row) => row.id,
  });

  // Memoize the counts for stats cards
  const requestCounts = useMemo(
    () => ({
      pending: pendingRequests.length,
      checked: checkedRequests.length,
      reviewed: reviewedRequests.length,
      approved: approvedRequests.length,
    }),
    [pendingRequests.length, checkedRequests.length, reviewedRequests.length, approvedRequests.length],
  );

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight_ text-2xl font-semibold">Approvals Overview</h1>
          <p className="text-muted-foreground text-sm">Manage and track all approval workflows</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requestCounts.pending}</div>
            <p className="text-muted-foreground mt-1 text-xs">Awaiting checker review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Checked</CardTitle>
            <FileCheck className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requestCounts.checked}</div>
            <p className="text-muted-foreground mt-1 text-xs">Ready for director review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <UserCheck className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requestCounts.reviewed}</div>
            <p className="text-muted-foreground mt-1 text-xs">Awaiting DG approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <ShieldCheck className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requestCounts.approved}</div>
            <p className="text-muted-foreground mt-1 text-xs">Sent to procurement</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className="hover:bg-accent cursor-pointer transition-colors"
          onClick={() => router.push("/dashboard/approvals/pending")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-yellow-500" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Review and approve requests awaiting your action</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:bg-accent cursor-pointer transition-colors"
          onClick={() => router.push("/dashboard/approvals/checked")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="size-5 text-blue-500" />
              Checked Requests
            </CardTitle>
            <CardDescription>Requests verified by checker, ready for review</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:bg-accent cursor-pointer transition-colors"
          onClick={() => router.push("/dashboard/approvals/reviewed")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="size-5 text-purple-500" />
              Reviewed Requests
            </CardTitle>
            <CardDescription>Director-reviewed requests awaiting final approval</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Review ({requestCounts.pending})</TabsTrigger>
          <TabsTrigger value="checked">Checked ({requestCounts.checked})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed ({requestCounts.reviewed})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({requestCounts.approved})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Requests awaiting initial checker review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <DataTable table={pendingTable} columns={approvalColumns} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checked" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Checked Requests</CardTitle>
              <CardDescription>Verified requests ready for director review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <DataTable table={checkedTable} columns={approvalColumns} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviewed Requests</CardTitle>
              <CardDescription>Director-reviewed requests awaiting DG approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <DataTable table={reviewedTable} columns={approvalColumns} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Requests</CardTitle>
              <CardDescription>DG-approved requests sent to procurement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <DataTable table={approvedTable} columns={approvalColumnsWithoutActions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
