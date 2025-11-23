"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  FileCheck,
  FileText,
  ShoppingCart,
  Users,
  Warehouse,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useGetStoresQuery,
  useGetContractorsQuery,
  useGetStoreVerificationsQuery,
  useGetStoreReceiveVouchersQuery,
  useGetStockReplenishmentsQuery,
  useGetDepartmentStockRequestsQuery,
} from "@/stores/services/procurementApi";

export default function ProcurementOverviewPage() {
  const router = useRouter();

  // Fetch data
  const { data: storesData, isLoading: storesLoading } = useGetStoresQuery();
  const { data: contractorsData, isLoading: contractorsLoading } = useGetContractorsQuery();
  const { data: svcData, isLoading: svcLoading } = useGetStoreVerificationsQuery({});
  const { data: srvData, isLoading: srvLoading } = useGetStoreReceiveVouchersQuery({});
  const { data: replenishmentsData, isLoading: replenishmentsLoading } = useGetStockReplenishmentsQuery({});
  const { data: deptRequestsData, isLoading: deptRequestsLoading } = useGetDepartmentStockRequestsQuery({});

  const stores = storesData?.data || [];
  const contractors = contractorsData?.data || [];
  const svcs = svcData?.data || [];
  const srvs = srvData?.data || [];
  const replenishments = replenishmentsData?.data || [];
  const deptRequests = deptRequestsData?.data || [];

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      totalStores: stores.length,
      activeContractors: contractors.filter((c) => c.status === "Active").length,
      pendingVerifications: svcs.filter((s) => s.status === "pending").length,
      pendingSRVs: srvs.filter((s) => s.status === "pending").length,
      pendingReplenishments: replenishments.filter((r) => r.status === "pending").length,
      pendingDeptRequests: deptRequests.filter(
        (d) => d.store_head_status === "pending" || d.director_gsd_status === "pending"
      ).length,
    };
  }, [stores, contractors, svcs, srvs, replenishments, deptRequests]);

  const isLoading =
    storesLoading ||
    contractorsLoading ||
    svcLoading ||
    srvLoading ||
    replenishmentsLoading ||
    deptRequestsLoading;

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Procurement Management</h1>
          <p className="text-muted-foreground text-sm">Manage stores, contractors, stock and procurement workflow</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Warehouse className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalStores}</div>
            <p className="text-muted-foreground text-xs">Active locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contractors</CardTitle>
            <Users className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.activeContractors}</div>
            <p className="text-muted-foreground text-xs">Active suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending SVC</CardTitle>
            <FileCheck className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.pendingVerifications}</div>
            <p className="text-muted-foreground text-xs">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending SRV</CardTitle>
            <FileText className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.pendingSRVs}</div>
            <p className="text-muted-foreground text-xs">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Replenishments</CardTitle>
            <ShoppingCart className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.pendingReplenishments}</div>
            <p className="text-muted-foreground text-xs">Pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dept Requests</CardTitle>
            <Package className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.pendingDeptRequests}</div>
            <p className="text-muted-foreground text-xs">Pending issuance</p>
          </CardContent>
        </Card>
      </div>

      {/* Process Flow Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Procurement Process Flow</CardTitle>
          <CardDescription>Understanding the workflow from goods receipt to payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                  <span className="text-sm font-bold">1</span>
                </div>
                <h3 className="font-semibold">Goods Receipt & Verification</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Contractor supplies goods → Store receives & verifies → Issues Store Verification Certificate (SVC)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                  <span className="text-sm font-bold">2</span>
                </div>
                <h3 className="font-semibold">Documentation & Approval</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Store issues SRV → Procurement compiles documents (Award Letter, Invoice, PO) → Sends to DG for
                approval
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                  <span className="text-sm font-bold">3</span>
                </div>
                <h3 className="font-semibold">Payment Processing</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                DG approves → Documents forwarded to Finance/Account → Payment processed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="hover:bg-accent cursor-pointer transition-colors"
          onClick={() => router.push("/dashboard/procurement/stores")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="size-5 text-blue-500" />
              Manage Stores
            </CardTitle>
            <CardDescription>View and manage store locations and inventory</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:bg-accent cursor-pointer transition-colors"
          onClick={() => router.push("/dashboard/procurement/contractors")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-green-500" />
              Contractors
            </CardTitle>
            <CardDescription>Manage contractor database and bank details</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:bg-accent cursor-pointer transition-colors"
          onClick={() => router.push("/dashboard/procurement/verifications")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="size-5 text-yellow-500" />
              Verifications (SVC)
            </CardTitle>
            <CardDescription>Store verification certificates and approvals</CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:bg-accent cursor-pointer transition-colors"
          onClick={() => router.push("/dashboard/procurement/vouchers")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-purple-500" />
              Receive Vouchers (SRV)
            </CardTitle>
            <CardDescription>Store receive vouchers and job completion</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Additional Processes */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Management</CardTitle>
          <CardDescription>Handle stock replenishment and inter-department requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              className="h-auto justify-start p-4"
              onClick={() => router.push("/dashboard/procurement/replenishments")}
            >
              <div className="flex flex-col items-start gap-1 text-left">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="size-5 text-purple-500" />
                  <span className="font-semibold">Stock Replenishment</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  Store Head → Director GSD → DG → Procurement
                </span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto justify-start p-4"
              onClick={() => router.push("/dashboard/procurement/department-requests")}
            >
              <div className="flex flex-col items-start gap-1 text-left">
                <div className="flex items-center gap-2">
                  <Package className="size-5 text-green-500" />
                  <span className="font-semibold">Department Requests</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  Department → Store Head → Director GSD → Issuance
                </span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}