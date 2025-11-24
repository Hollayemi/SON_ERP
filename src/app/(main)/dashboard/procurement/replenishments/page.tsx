"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ShoppingCart, Plus, Eye, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useGetStockReplenishmentsQuery,
  useCreateStockReplenishmentMutation,
  useApproveStockReplenishmentMutation,
} from "@/stores/services/procurementApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { StockReplenishment } from "@/types/procurement";

export default function StockReplenishmentPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useGetStockReplenishmentsQuery({});
  const replenishments = data?.data || [];

  const filteredData = useMemo(
    () =>
      replenishments.filter((replenishment) => {
        const matchesSearch =
          searchQuery === "" || replenishment.item_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || replenishment.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [replenishments, searchQuery, statusFilter],
  );

  const columns: ColumnDef<StockReplenishment>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Request ID" />,
        cell: ({ row }) => <div className="font-mono font-medium">REP-{row.getValue("id")}</div>,
      },
      {
        accessorKey: "item_name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Item Name" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue("item_name")}</div>,
      },
      {
        accessorKey: "quantity_requested",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
        cell: ({ row }) => <div className="text-center">{row.getValue("quantity_requested")}</div>,
      },
      {
        id: "store",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Store" />,
        cell: ({ row }) => <div>{row.original.store?.name || "N/A"}</div>,
      },
      {
        id: "initiatedBy",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Initiated By" />,
        cell: ({ row }) => (
          <div>
            {row.original.initiated_by_user
              ? `${row.original.initiated_by_user.first_name} ${row.original.initiated_by_user.last_name}`
              : "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "director_gsd_approval",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Director GSD" />,
        cell: ({ row }) => {
          const status = row.getValue("director_gsd_approval") as string;
          return <ApprovalBadge status={status} />;
        },
      },
      {
        accessorKey: "dg_approval",
        header: ({ column }) => <DataTableColumnHeader column={column} title="DG Approval" />,
        cell: ({ row }) => {
          const status = row.getValue("dg_approval") as string;
          return <ApprovalBadge status={status} />;
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const statusConfig: Record<string, { color: string; icon: any }> = {
            pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
            approved: {
              color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
              icon: CheckCircle2,
            },
            in_procurement: {
              color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
              icon: ShoppingCart,
            },
            completed: {
              color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
              icon: CheckCircle2,
            },
          };
          const config = statusConfig[status] || statusConfig.pending;
          const Icon = config.icon;

          return (
            <Badge variant="outline" className={config.color}>
              <Icon className="mr-1 size-3" />
              {status.replace("_", " ").charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.push(`/dashboard/procurement/replenishments/${row.original.id}`)}
            >
              <Eye className="size-4" />
            </Button>
            {row.original.director_gsd_approval === "pending" && (
              <ApproveButton id={row.original.id} approvalType="director_gsd" />
            )}
            {row.original.director_gsd_approval === "approved" && row.original.dg_approval === "pending" && (
              <ApproveButton id={row.original.id} approvalType="dg" />
            )}
          </div>
        ),
      },
    ],
    [router],
  );

  const table = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id.toString(),
  });

  const stats = useMemo(() => {
    return {
      total: replenishments.length,
      pending: replenishments.filter((r) => r.status === "pending").length,
      approved: replenishments.filter((r) => r.status === "approved").length,
      inProcurement: replenishments.filter((r) => r.status === "in_procurement").length,
      completed: replenishments.filter((r) => r.status === "completed").length,
    };
  }, [replenishments]);

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight_ text-2xl font-semibold">Stock Replenishment</h1>
          <p className="text-muted-foreground text-sm">Manage stock replenishment requests and approvals</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Replenishment Request</DialogTitle>
            </DialogHeader>
            <CreateReplenishmentForm
              onSuccess={() => {
                setDialogOpen(false);
                toast.success("Replenishment request created");
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <ShoppingCart className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Procurement</CardTitle>
            <AlertCircle className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.inProcurement}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Process Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Replenishment Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <Badge>Store Head Initiates</Badge>
            <span>→</span>
            <Badge variant="outline">Director GSD Approves</Badge>
            <span>→</span>
            <Badge variant="outline">DG Approves</Badge>
            <span>→</span>
            <Badge variant="outline">Procurement Processes</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Replenishment Requests</CardTitle>
          <CardDescription>All stock replenishment requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by item name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_procurement">In Procurement</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
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

function ApprovalBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: any }> = {
    pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
    approved: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
    rejected: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
  };
  const statusConfig = config[status] || config.pending;
  const Icon = statusConfig.icon;

  return (
    <Badge variant="outline" className={statusConfig.color}>
      <Icon className="mr-1 size-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function CreateReplenishmentForm({ onSuccess }: { onSuccess: () => void }) {
  const [createReplenishment, { isLoading }] = useCreateStockReplenishmentMutation();
  const [formData, setFormData] = useState({
    store_id: "",
    item_name: "",
    quantity_requested: "",
    justification: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReplenishment({
        ...formData,
        store_id: Number(formData.store_id),
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error("Failed to create replenishment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="store_id">Store ID *</Label>
          <Input
            id="store_id"
            type="number"
            required
            value={formData.store_id}
            onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity_requested">Quantity *</Label>
          <Input
            id="quantity_requested"
            required
            value={formData.quantity_requested}
            onChange={(e) => setFormData({ ...formData, quantity_requested: e.target.value })}
            placeholder="e.g., 100 units"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="item_name">Item Name *</Label>
        <Input
          id="item_name"
          required
          value={formData.item_name}
          onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
          placeholder="Item to replenish"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="justification">Justification *</Label>
        <Textarea
          id="justification"
          required
          value={formData.justification}
          onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
          placeholder="Explain why this replenishment is needed"
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Request"}
      </Button>
    </form>
  );
}

function ApproveButton({ id, approvalType }: { id: number; approvalType: "director_gsd" | "dg" }) {
  const [approve, { isLoading }] = useApproveStockReplenishmentMutation();

  const handleApprove = async (status: "approved" | "rejected") => {
    try {
      await approve({ id, approval_type: approvalType, status }).unwrap();
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} request`);
    }
  };

  return (
    <div className="flex gap-1">
      <Button size="sm" onClick={() => handleApprove("approved")} disabled={isLoading}>
        <CheckCircle2 className="size-4" />
      </Button>
      <Button size="sm" variant="destructive" onClick={() => handleApprove("rejected")} disabled={isLoading}>
        <XCircle className="size-4" />
      </Button>
    </div>
  );
}
