"use client";

import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

import { DataTable } from "@/components/data-table/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useGetStoresQuery } from "@/stores/services/procurementApi";
import { Store } from "@/types/procurement";
import {
  StoreStats,
  StoreFilters,
  useStoreColumns,
  CreateStoreForm,
  EditStoreForm,
  ViewStoreDetails,
} from "../_component/stores-component";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data, isLoading } = useGetStoresQuery();
  const stores = data?.data || [];

  const filteredData = useMemo(
    () =>
      stores.filter((store: Store) => {
        const matchesSearch =
          searchQuery === "" ||
          store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || store.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [stores, searchQuery, statusFilter],
  );

  const columns = useStoreColumns(setSelectedStore, setViewDialogOpen, setEditDialogOpen);
  const table = useDataTableInstance({ data: filteredData, columns }) as any;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight_ text-2xl font-semibold">Stores Management</h1>
          <p className="text-muted-foreground text-sm">Manage store locations and inventory</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
              <DialogDescription>Create a new store location</DialogDescription>
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
      <StoreStats stores={stores} isLoading={isLoading} />

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Store Locations</CardTitle>
          <CardDescription>View and manage all store locations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <StoreFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <div className="overflow-hidden rounded-lg border">
            <DataTable table={table} columns={columns} />
          </div>

          <DataTablePagination table={table} />
        </CardContent>
      </Card>

      {/* View Store Dialog */}
      {selectedStore && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Store Details</DialogTitle>
              <DialogDescription>View complete store information</DialogDescription>
            </DialogHeader>
            <ViewStoreDetails store={selectedStore} />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Store Dialog */}
      {selectedStore && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Store</DialogTitle>
              <DialogDescription>Update store information</DialogDescription>
            </DialogHeader>
            <EditStoreForm
              store={selectedStore}
              onSuccess={() => {
                setEditDialogOpen(false);
                toast.success("Store updated successfully");
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
