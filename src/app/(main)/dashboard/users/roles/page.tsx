"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { rolesColumns } from "../_components/roles-columns";
import { permissionsColumns } from "../_components/permissions-columns";
import { CreateRoleDialog } from "../_components/create-role-dialog";
import { CreatePermissionDialog } from "../_components/create-permission-dialog";
import { useGetPermissionsQuery, useGetRolesQuery } from "@/stores/services/usersApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function RolesPermissionsPage() {
  const [roleSearchQuery, setRoleSearchQuery] = useState("");
  const [permissionSearchQuery, setPermissionSearchQuery] = useState("");

  const { data: rolesResponse, isLoading: loadingRoles, refetch: refetchRoles } = useGetRolesQuery();
  const {
    data: permissionsResponse,
    isLoading: loadingPermissions,
    refetch: refetchPermissions,
  } = useGetPermissionsQuery();

  const roles = rolesResponse?.data || [];
  const permissions = permissionsResponse?.data || [];

  // Filter roles based on search
  const filteredRoles = useMemo(() => {
    if (!roles) return [];
    return roles.filter((role: any) => role.name.toLowerCase().includes(roleSearchQuery.toLowerCase()));
  }, [roleSearchQuery, roles]);

  // Filter permissions based on search
  const filteredPermissions = useMemo(() => {
    if (!permissions) return [];
    return permissions.filter((permission: any) =>
      permission.name.toLowerCase().includes(permissionSearchQuery.toLowerCase()),
    );
  }, [permissionSearchQuery, permissions]);

  const rolesTable = useDataTableInstance({
    data: filteredRoles,
    columns: rolesColumns,
    getRowId: (row: any) => row.id.toString(),
  });

  const permissionsTable = useDataTableInstance({
    data: filteredPermissions,
    columns: permissionsColumns,
    getRowId: (row: any) => row.id.toString(),
  });

  const handleRefetch = () => {
    refetchRoles();
    refetchPermissions();
  };

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Roles & Permissions</h1>
        <p className="text-muted-foreground text-sm">
          Manage user roles and permissions to control access across the system
        </p>
      </div>

      {/* Tabs for Roles and Permissions */}
      <Tabs defaultValue="roles" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manage Roles</CardTitle>
                  <CardDescription>Create and manage roles with specific permission sets</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <CreateRoleDialog permissions={permissions} onSuccess={handleRefetch} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search roles..."
                    value={roleSearchQuery}
                    onChange={(e) => setRoleSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <DataTableViewOptions table={rolesTable} />
                  <Button variant="outline" size="sm">
                    <Download />
                    Export
                  </Button>
                </div>
              </div>

              {/* Table */}
              {loadingRoles ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="overflow-hidden rounded-md border">
                    <DataTable table={rolesTable} columns={rolesColumns} />
                  </div>
                  <DataTablePagination table={rolesTable} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manage Permissions</CardTitle>
                  <CardDescription>Define specific permissions for different system modules</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <CreatePermissionDialog onSuccess={refetchPermissions} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search permissions..."
                    value={permissionSearchQuery}
                    onChange={(e) => setPermissionSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <DataTableViewOptions table={permissionsTable} />
                  <Button variant="outline" size="sm">
                    <Download />
                    Export
                  </Button>
                </div>
              </div>

              {/* Table */}
              {loadingPermissions ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="overflow-hidden rounded-md border">
                    <DataTable table={permissionsTable} columns={permissionsColumns} />
                  </div>
                  <DataTablePagination table={permissionsTable} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
