"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { FileText, Plus, Eye, CheckCircle2, Clock } from "lucide-react";

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
  useGetStoreReceiveVouchersQuery,
  useCreateStoreReceiveVoucherMutation,
} from "@/stores/services/procurementApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { StoreReceiveVoucher } from "@/types/procurement";

export default function StoreReceiveVouchersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useGetStoreReceiveVouchersQuery({});
  const vouchers = data?.data || [];

  const filteredData = useMemo(
    () =>
      vouchers.filter((voucher) => {
        const matchesSearch =
          searchQuery === "" || voucher.srv_number.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || voucher.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [vouchers, searchQuery, statusFilter],
  );

  const columns: ColumnDef<StoreReceiveVoucher>[] = useMemo(
    () => [
      {
        accessorKey: "srv_number",
        header: ({ column }: { column: any }) => <DataTableColumnHeader column={column} title="SRV Number" />,
        cell: ({ row }: { row: any }) => <div className="font-mono font-medium">{row.getValue("srv_number")}</div>,
      },
      {
        id: "svc",
        header: ({ column }: { column: any }) => <DataTableColumnHeader column={column} title="Related SVC" />,
        cell: ({ row }: { row: any }) => (
          <div className="font-mono text-sm">{row.original.svc?.verification_number || "N/A"}</div>
        ),
      },
      {
        id: "receivedBy",
        header: ({ column }: { column: any }) => <DataTableColumnHeader column={column} title="Received By" />,
        cell: ({ row }: { row: any }) => (
          <div>
            {row.original.received_by_user
              ? `${row.original.received_by_user.first_name} ${row.original.received_by_user.last_name}`
              : "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "receive_date",
        header: ({ column }: { column: any }) => <DataTableColumnHeader column={column} title="Receive Date" />,
        cell: ({ row }: { row: any }) => {
          const date = new Date(row.getValue("receive_date"));
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
        header: ({ column }: { column: any }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }: { row: any }) => {
          const status = row.getValue("status") as string;
          const statusConfig = {
            pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
            completed: {
              color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
              icon: CheckCircle2,
            },
          };
          const config = statusConfig[status as keyof typeof statusConfig];
          const Icon = config?.icon || Clock;

          return (
            <Badge variant="outline" className={config?.color}>
              <Icon className="mr-1 size-3" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }: { column: any }) => <DataTableColumnHeader column={column} title="Created" />,
        cell: ({ row }: { row: any }) => {
          const date = new Date(row.getValue("created_at"));
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
        cell: ({ row }: { row: any }) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/dashboard/procurement/vouchers/${row.original.id}`)}
          >
            <Eye className="size-4" />
          </Button>
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
      total: vouchers.length,
      pending: vouchers.filter((v) => v.status === "pending").length,
      completed: vouchers.filter((v) => v.status === "completed").length,
    };
  }, [vouchers]);

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight_ text-2xl font-semibold">Store Receive Vouchers (SRV)</h1>
          <p className="text-muted-foreground text-sm">Job completion certificates for received goods</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              New Voucher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Store Receive Voucher</DialogTitle>
            </DialogHeader>
            <CreateSRVForm
              onSuccess={() => {
                setDialogOpen(false);
                toast.success("SRV created successfully");
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total SRVs</CardTitle>
            <FileText className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.total}</div>
            <p className="text-muted-foreground text-xs">All vouchers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.pending}</div>
            <p className="text-muted-foreground text-xs">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.completed}</div>
            <p className="text-muted-foreground text-xs">Job completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Store Receive Vouchers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Store Receive Vouchers (SRV) serve as job completion certificates. After goods are verified (SVC), an SRV is
            issued. The SRV, along with other procurement documents (Award Letter, Invoice, Purchase Order), is then
            sent to the Director General for approval before proceeding to Finance for payment processing.
          </p>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Receive Vouchers</CardTitle>
          <CardDescription>All store receive vouchers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by SRV number..."
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

function CreateSRVForm({ onSuccess }: { onSuccess: () => void }) {
  const [createSRV, { isLoading }] = useCreateStoreReceiveVoucherMutation();
  const [formData, setFormData] = useState({
    svc_id: "",
    receive_date: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSRV({
        ...formData,
        svc_id: Number(formData.svc_id),
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error("Failed to create SRV:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="svc_id">Related SVC ID *</Label>
        <Input
          id="svc_id"
          type="number"
          required
          value={formData.svc_id}
          onChange={(e) => setFormData({ ...formData, svc_id: e.target.value })}
          placeholder="Enter SVC ID"
        />
        <p className="text-muted-foreground text-xs">
          Enter the ID of the Store Verification Certificate this voucher relates to
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="receive_date">Receive Date *</Label>
        <Input
          id="receive_date"
          type="date"
          required
          value={formData.receive_date}
          onChange={(e) => setFormData({ ...formData, receive_date: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          placeholder="Additional notes or comments"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create SRV"}
        </Button>
      </div>
    </form>
  );
}
