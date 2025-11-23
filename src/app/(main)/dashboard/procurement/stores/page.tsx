"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Warehouse, Plus, Eye, Edit, Package, TrendingUp, MapPin } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetStoresQuery } from "@/stores/services/procurementApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateStoreMutation } from "@/stores/services/procurementApi";
import { toast } from "sonner";
import { Store } from "@/types/procurement";

export default function StoresManagementPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, isLoading } = useGetStoresQuery();
    const [createStore, { isLoading: isCreating }] = useCreateStoreMutation();

    const stores = data?.data || [];

    const filteredData = useMemo(
        () =>
            stores.filter((store) => {
                const matchesSearch =
                    searchQuery === "" ||
                    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    store.code.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesStatus = statusFilter === "all" || store.status === statusFilter;
                return matchesSearch && matchesStatus;
            }),
        [stores, searchQuery, statusFilter]
    );

    const columns: ColumnDef<Store>[] = useMemo(
        () => [
            {
                accessorKey: "code",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Store Code" />,
                cell: ({ row }) => <div className="font-mono font-medium">{row.getValue("code")}</div>,
            },
            {
                accessorKey: "name",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Store Name" />,
                cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
            },
            {
                id: "location",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span>{row.original.state_office?.state?.name || "N/A"}</span>
                    </div>
                ),
            },
            {
                id: "storeHead",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Store Head" />,
                cell: ({ row }) => (
                    <div>
                        {row.original.store_head
                            ? `${row.original.store_head.first_name} ${row.original.store_head.last_name}`
                            : "Not Assigned"}
                    </div>
                ),
            },
            {
                id: "stockItems",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Stock Items" />,
                cell: ({ row }) => (
                    <div className="text-center">
                        <Badge variant="outline">{row.original.stock_items?.length || 0}</Badge>
                    </div>
                ),
            },
            {
                accessorKey: "status",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
                cell: ({ row }) => {
                    const status = row.getValue("status") as string;
                    return (
                        <Badge
                            variant="outline"
                            className={
                                status === "Active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                            }
                        >
                            {status}
                        </Badge>
                    );
                },
            },
            {
                id: "actions",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => router.push(`/dashboard/procurement/stores/${row.original.id}`)}>
                            <Eye className="size-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => router.push(`/dashboard/procurement/stores/${row.original.id}/edit`)}>
                            <Edit className="size-4" />
                        </Button>
                    </div>
                ),
            },
        ],
        [router]
    );

    const table = useDataTableInstance({
        data: filteredData,
        columns,
        getRowId: (row) => row.id.toString(),
    });

    // Calculate stats
    const stats = useMemo(() => {
        const totalItems = stores.reduce((sum, store) => sum + (store.stock_items?.length || 0), 0);
        return {
            totalStores: stores.length,
            activeStores: stores.filter((s) => s.status === "Active").length,
            totalStockItems: totalItems,
        };
    }, [stores]);

    return (
        <div className="@container/main flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Stores Management</h1>
                    <p className="text-muted-foreground text-sm">Manage store locations and inventory</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2" />
                            Add Store
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Store</DialogTitle>
                        </DialogHeader>
                        <CreateStoreForm
                            onSuccess={() => {
                                setDialogOpen(false);
                                toast.success("Store created successfully");
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
                        <Warehouse className="text-muted-foreground size-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalStores}</div>
                        <p className="text-muted-foreground text-xs">All locations</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
                        <TrendingUp className="size-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : stats.activeStores}</div>
                        <p className="text-muted-foreground text-xs">Currently operational</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Stock Items</CardTitle>
                        <Package className="text-muted-foreground size-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalStockItems}</div>
                        <p className="text-muted-foreground text-xs">Across all stores</p>
                    </CardContent>
                </Card>
            </div>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Store Locations</CardTitle>
                    <CardDescription>View and manage all store locations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by store name or code..."
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
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
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

function CreateStoreForm({ onSuccess }: { onSuccess: () => void }) {
    const [createStore, { isLoading }] = useCreateStoreMutation();
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        store_head_id: "",
        state_office_id: "",
        description: "",
        address: "",
        phone: "",
        email: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createStore({
                ...formData,
                store_head_id: Number(formData.store_head_id),
                state_office_id: Number(formData.state_office_id),
            }).unwrap();
            onSuccess();
        } catch (error) {
            console.error("Failed to create store:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Store Name *</Label>
                    <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Lagos Central Store"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="code">Store Code *</Label>
                    <Input
                        id="code"
                        required
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="e.g., STR-001"
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="store_head_id">Store Head ID *</Label>
                    <Input
                        id="store_head_id"
                        type="number"
                        required
                        value={formData.store_head_id}
                        onChange={(e) => setFormData({ ...formData, store_head_id: e.target.value })}
                        placeholder="User ID"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="state_office_id">State Office ID *</Label>
                    <Input
                        id="state_office_id"
                        type="number"
                        required
                        value={formData.state_office_id}
                        onChange={(e) => setFormData({ ...formData, state_office_id: e.target.value })}
                        placeholder="Office ID"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Store address"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+234..."
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="store@example.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional details about the store"
                />
            </div>

            <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Store"}
                </Button>
            </div>
        </form>
    );
}