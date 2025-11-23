"use client";

import { useMemo, useState } from "react";
import { Plus, Download, Search, Loader2 } from "lucide-react";
import Link from "next/link";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { userColumns } from "./_components/columns";
import { useGetUsersQuery } from "@/stores/services/usersApi";

export default function AllUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Active" | "Inactive" | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // Fetch users from API
  const { data, isLoading, isFetching, error } = useGetUsersQuery({
    page: currentPage,
    per_page: perPage,
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const users = data?.data?.data || [];
  const paginationMeta = data?.data?.pagination_meta;

  // Filter users based on search query (client-side additional filtering)
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;

    return users.filter(
      (user: any) =>
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.state_office_department?.department?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const table = useDataTableInstance<any, any>({
    data: filteredUsers,
    columns: userColumns,
    getRowId: (row) => row.id.toString(),
  });

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>User Management</CardTitle>

          <CardDescription>
            Manage users, roles, and permissions in your organization. Total: {paginationMeta?.total || 0} users
          </CardDescription>
        
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button variant="outline" size="sm">
                <Download />
                <span className="hidden lg:inline">Export</span>
              </Button>
              <Link href="/dashboard/users/new">
                <Button size="sm">
                  <Plus />
                  <span className="hidden lg:inline">Add User</span>
                </Button>
              </Link>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search users by name, email, phone, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: "Active" | "Inactive" | "all") => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-destructive text-sm">Failed to load users. Please try again.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              {/* Data Table */}
              <div className="rounded-md border">
                <DataTable table={table} columns={userColumns} />
              </div>

              {/* Pagination */}
              {paginationMeta && (
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground text-sm">
                    Showing {paginationMeta.from} to {paginationMeta.to} of {paginationMeta.total} users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!paginationMeta.prev_page_url || isFetching}
                    >
                      {isFetching ? <Loader2 className="size-4 animate-spin" /> : "Previous"}
                    </Button>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">
                        Page {paginationMeta.current_page} of {paginationMeta.last_page}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!paginationMeta.next_page_url || isFetching}
                    >
                      {isFetching ? <Loader2 className="size-4 animate-spin" /> : "Next"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}