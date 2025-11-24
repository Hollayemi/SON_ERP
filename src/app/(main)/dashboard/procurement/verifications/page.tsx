"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { FileCheck, Plus, Eye, CheckCircle2, XCircle, Clock } from "lucide-react";

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
  useGetStoreVerificationsQuery,
  useCreateStoreVerificationMutation,
  useUpdateStoreVerificationMutation,
} from "@/stores/services/procurementApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { StoreVerificationCertificate } from "@/types/procurement";

export default function StoreVerificationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useGetStoreVerificationsQuery({});
  const verifications = data?.data || [];

  const filteredData = useMemo(
    () =>
      verifications.filter((verification) => {
        const matchesSearch =
          searchQuery === "" ||
          verification.verification_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          verification.goods_description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || verification.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [verifications, searchQuery, statusFilter],
  );

  const columns: ColumnDef<StoreVerificationCertificate>[] = useMemo(
    () => [
      {
        accessorKey: "verification_number",
        header: ({ column }) => <DataTableColumnHeader column={column} title="SVC Number" />,
        cell: ({ row }) => <div className="font-mono font-medium">{row.getValue("verification_number")}</div>,
      },
      {
        accessorKey: "goods_description",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Goods Description" />,
        cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue("goods_description")}</div>,
      },
      {
        id: "contractor",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Contractor" />,
        cell: ({ row }) => <div>{row.original.contractor?.name || "N/A"}</div>,
      },
      {
        id: "store",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Store" />,
        cell: ({ row }) => <div>{row.original.store?.name || "N/A"}</div>,
      },
      {
        accessorKey: "quantity_received",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
        cell: ({ row }) => <div className="text-center">{row.getValue("quantity_received")}</div>,
      },
      {
        accessorKey: "verification_date",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Verification Date" />,
        cell: ({ row }) => {
          const date = new Date(row.getValue("verification_date"));
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
          const status = row.getValue("status") as string;
          const statusConfig = {
            pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
            verified: {
              color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
              icon: CheckCircle2,
            },
            rejected: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
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
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.push(`/dashboard/procurement/verifications/${row.original.id}`)}
            >
              <Eye className="size-4" />
            </Button>
            {row.original.status === "pending" && (
              <>
                <VerifyButton id={row.original.id} action="verified" />
                <VerifyButton id={row.original.id} action="rejected" />
              </>
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
      total: verifications.length,
      pending: verifications.filter((v) => v.status === "pending").length,
      verified: verifications.filter((v) => v.status === "verified").length,
      rejected: verifications.filter((v) => v.status === "rejected").length,
    };
  }, [verifications]);

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight_ text-2xl font-semibold">Store Verification Certificates (SVC)</h1>
          <p className="text-muted-foreground text-sm">Verify goods received from contractors</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              New Verification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Store Verification Certificate</DialogTitle>
            </DialogHeader>
            <CreateSVCForm
              onSuccess={() => {
                setDialogOpen(false);
                toast.success("SVC created successfully");
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total SVCs</CardTitle>
            <FileCheck className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.total}</div>
            <p className="text-muted-foreground text-xs">All certificates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.pending}</div>
            <p className="text-muted-foreground text-xs">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle2 className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.verified}</div>
            <p className="text-muted-foreground text-xs">Approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.rejected}</div>
            <p className="text-muted-foreground text-xs">Not approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Certificates</CardTitle>
          <CardDescription>All store verification certificates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search by SVC number or goods description..."
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
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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

function CreateSVCForm({ onSuccess }: { onSuccess: () => void }) {
  const [createSVC, { isLoading }] = useCreateStoreVerificationMutation();
  const [formData, setFormData] = useState({
    store_id: "",
    contractor_id: "",
    goods_description: "",
    quantity_received: "",
    verification_date: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSVC({
        ...formData,
        store_id: Number(formData.store_id),
        contractor_id: Number(formData.contractor_id),
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error("Failed to create SVC:", error);
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
            placeholder="Store ID"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contractor_id">Contractor ID *</Label>
          <Input
            id="contractor_id"
            type="number"
            required
            value={formData.contractor_id}
            onChange={(e) => setFormData({ ...formData, contractor_id: e.target.value })}
            placeholder="Contractor ID"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goods_description">Goods Description *</Label>
        <Textarea
          id="goods_description"
          required
          value={formData.goods_description}
          onChange={(e) => setFormData({ ...formData, goods_description: e.target.value })}
          placeholder="Describe the goods received"
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="quantity_received">Quantity Received *</Label>
          <Input
            id="quantity_received"
            required
            value={formData.quantity_received}
            onChange={(e) => setFormData({ ...formData, quantity_received: e.target.value })}
            placeholder="e.g., 100 units"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="verification_date">Verification Date *</Label>
          <Input
            id="verification_date"
            type="date"
            required
            value={formData.verification_date}
            onChange={(e) => setFormData({ ...formData, verification_date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          placeholder="Additional notes or comments"
          rows={2}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create SVC"}
        </Button>
      </div>
    </form>
  );
}

function VerifyButton({ id, action }: { id: number; action: "verified" | "rejected" }) {
  const [updateSVC, { isLoading }] = useUpdateStoreVerificationMutation();

  const handleClick = async () => {
    try {
      await updateSVC({ id, status: action }).unwrap();
      toast.success(`SVC ${action} successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} SVC`);
    }
  };

  return (
    <Button
      size="sm"
      variant={action === "verified" ? "default" : "destructive"}
      onClick={handleClick}
      disabled={isLoading}
    >
      {action === "verified" ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
    </Button>
  );
}
