"use client";

import { useState } from "react";
import { Shield, Key, Download, Search } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { mockRoles, mockPermissions } from "../_components/data";
import { rolesColumns } from "../_components/roles-columns";
import { permissionsColumns } from "../_components/permissions-columns";
import { CreateRoleDialog } from "../_components/create-role-dialog";
import { CreatePermissionDialog } from "../_components/create-permission-dialog";

export default function RolesPermissionsPage() {
  const [roleSearchQuery, setRoleSearchQuery] = useState("");
  const [permissionSearchQuery, setPermissionSearchQuery] = useState("");

  // Filter roles based on search
  const filteredRoles = mockRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(roleSearchQuery.toLowerCase()),
  );

  // Filter permissions based on search
  const filteredPermissions = mockPermissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(permissionSearchQuery.toLowerCase()) ||
      permission.module.toLowerCase().includes(permissionSearchQuery.toLowerCase()),
  );

  const rolesTable = useDataTableInstance({
    data: filteredRoles,
    columns: rolesColumns,
    getRowId: (row) => row.id,
  });

  const permissionsTable = useDataTableInstance({
    data: filteredPermissions,
    columns: permissionsColumns,
    getRowId: (row) => row.id,
  });

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
                  <CreateRoleDialog />
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
              <div className="overflow-hidden rounded-md border">
                <DataTable table={rolesTable} columns={rolesColumns} />
              </div>
              <DataTablePagination table={rolesTable} />
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
                  <CreatePermissionDialog />
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
              <div className="overflow-hidden rounded-md border">
                <DataTable table={permissionsTable} columns={permissionsColumns} />
              </div>
              <DataTablePagination table={permissionsTable} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
