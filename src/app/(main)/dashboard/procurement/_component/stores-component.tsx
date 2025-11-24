"use client";

import React, { useMemo, useState } from "react";
import { Plus, Eye, Edit, Warehouse, Package, MapPin, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useGetStoresQuery, useCreateStoreMutation, useUpdateStoreMutation } from "@/stores/services/procurementApi";
import { Store } from "@/types/procurement";

export interface StoreFormData {
  name: string;
  code: string;
  store_head_id: string;
  state_office_id: string;
  description: string;
  address: string;
  phone: string;
  email: string;
}
// Re-usable components
export function CreateStoreForm({ onSuccess }: { onSuccess: () => void }) {
  const [createStore, { isLoading }] = useCreateStoreMutation();
  const [formData, setFormData] = useState<StoreFormData>({
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
      toast.error("Failed to create store");
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

export function EditStoreForm({ store, onSuccess }: { store: Store; onSuccess: () => void }) {
  const [updateStore, { isLoading }] = useUpdateStoreMutation();
  const [formData, setFormData] = useState<StoreFormData>({
    name: store.name || "",
    code: store.code || "",
    store_head_id: store.store_head_id?.toString() || "",
    state_office_id: store.state_office_id?.toString() || "",
    description: store.description || "",
    address: store.address || "",
    phone: store.phone || "",
    email: store.email || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStore({
        id: store.id,
        ...formData,
        store_head_id: Number(formData.store_head_id),
        state_office_id: Number(formData.state_office_id),
      }).unwrap();
      onSuccess();
    } catch (error) {
      toast.error("Failed to update store");
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">Store Code *</Label>
          <Input
            id="code"
            required
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Store"}
        </Button>
      </div>
    </form>
  );
}

export function ViewStoreDetails({ store }: { store: Store }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-muted-foreground">Store Name</Label>
          <p className="font-medium">{store.name}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Store Code</Label>
          <p className="font-mono font-medium">{store.code}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-muted-foreground">Store Head</Label>
          <p className="font-medium">
            {store.store_head ? `${store.store_head.first_name} ${store.store_head.last_name}` : "Not Assigned"}
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Location</Label>
          <p className="font-medium">{store.state_office?.state?.name || "N/A"}</p>
        </div>
      </div>

      {store.address && (
        <div className="space-y-2">
          <Label className="text-muted-foreground">Address</Label>
          <p>{store.address}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {store.phone && (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Phone</Label>
            <p className="font-mono">{store.phone}</p>
          </div>
        )}
        {store.email && (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Email</Label>
            <p>{store.email}</p>
          </div>
        )}
      </div>

      {store.description && (
        <div className="space-y-2">
          <Label className="text-muted-foreground">Description</Label>
          <p>{store.description}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-muted-foreground">Stock Items</Label>
        <Badge variant="outline" className="font-mono">
          {store.stock_items?.length || 0} items
        </Badge>
      </div>
    </div>
  );
}

export function StoreStats({ stores, isLoading }: { stores: Store[]; isLoading: boolean }) {
  const stats = useMemo(() => {
    const totalItems = stores.reduce((sum, store) => sum + (store.stock_items?.length || 0), 0);
    return {
      totalStores: stores.length,
      activeStores: stores.filter((s) => s.status === "Active").length,
      totalStockItems: totalItems,
    };
  }, [stores]);

  return (
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
          <Warehouse className="size-4 text-green-500" />
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
  );
}

export function StoreFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}) {
  return (
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
  );
}

export function useStoreColumns(
  setSelectedStore: (store: Store) => void,
  setViewDialogOpen: (open: boolean) => void,
  setEditDialogOpen: (open: boolean) => void,
) {
  return useMemo(
    () => [
      {
        accessorKey: "code",
        header: ({ column }: { column: any }) => <DataTableColumnHeader column={column} title="Store Code" />,
        cell: ({ row }: { row: any }) => <div className="font-mono font-medium">{row.getValue("code")}</div>,
      },
      {
        accessorKey: "name",
        header: ({ column }: { column: any }) => <DataTableColumnHeader column={column} title="Store Name" />,
        cell: ({ row }: { row: any }) => <div className="font-medium">{row.getValue("name")}</div>,
      },
      {
        id: "location",
        header: ({ column }: { column: any }) => <DataTableColumnHeader column={column} title="Location" />,
        cell: ({ row }: { row: any }) => (
          <div className="flex items-center gap-2">
            <MapPin className="text-muted-foreground size-4" />
            <span>{row.original.state_office?.state?.name || "N/A"}</span>
          </div>
        ),
      },
      {
        id: "storeHead",
        header: ({ column }: { column: any }) => <DataTableColumnHeader column={column} title="Store Head" />,
        cell: ({ row }: { row: any }) => (
          <div className="flex items-center gap-2">
            <User className="text-muted-foreground size-4" />
            <span>
              {row.original.store_head
                ? `${row.original.store_head.first_name} ${row.original.store_head.last_name}`
                : "Not Assigned"}
            </span>
          </div>
        ),
      },
      {
        id: "stockItems",
        header: ({ column }: { column: any }) => <DataTableColumnHeader column={column} title="Stock Items" />,
        cell: ({ row }: { row: any }) => (
          <div className="text-center">
            <Badge variant="outline" className="font-mono">
              {row.original.stock_items?.length || 0}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }: { column: any }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }: { row: any }) => {
          const status = row.getValue("status");
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
        cell: ({ row }: { row: any }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelectedStore(row.original);
                setViewDialogOpen(true);
              }}
            >
              <Eye className="size-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelectedStore(row.original);
                setEditDialogOpen(true);
              }}
            >
              <Edit className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [setSelectedStore, setViewDialogOpen, setEditDialogOpen],
  );
}

// Hook for data table
export function useDataTableInstance({ data, columns }: any) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);

  return {
    getRowModel: () => ({
      rows: data.map((row: Store, i: number) => ({
        id: row.id,
        original: row,
        getValue: (key: string) => row[key as keyof Store],
      })),
    }),
    getHeaderGroups: () => [{ id: "1", headers: columns.map((col: any, i: number) => ({ id: i, column: col })) }],
    getState: () => ({ rowSelection, sorting, columnFilters, pagination: { pageIndex: 0, pageSize: 10 } }),
    setRowSelection,
    setSorting,
    setColumnFilters,
  };
}
