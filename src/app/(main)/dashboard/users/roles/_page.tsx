"use client";
import React, { useState } from "react";
import { Check, X, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Type definitions
interface Role {
  id: number;
  name: string;
  description: string;
  canManage: boolean;
}

interface Permission {
  id: number;
  name: string;
  label: string;
  category: string;
}

interface PermissionMatrix {
  [roleId: number]: number[];
}

interface ExpandedRoles {
  [roleId: number]: boolean;
}

const RolesPermissionsMatrix = () => {
  const [expandedRoles, setExpandedRoles] = useState<ExpandedRoles>({});
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrix>({
    1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    2: [7, 8, 4],
    3: [9, 10, 11, 4],
    4: [12, 13, 4],
    5: [14, 4],
    6: [15, 4],
    7: [4, 5, 6],
    8: [4],
  });

  const canGrantPermissions = (roleId: number): boolean => {
    return [1, 2, 3, 4].includes(roleId);
  };

  const roles: Role[] = [
    {
      id: 1,
      name: "System Administrator",
      description: "Manages system-wide configuration and user access",
      canManage: true,
    },
    {
      id: 2,
      name: "Director of Standards",
      description: "Oversees product standardization and approvals",
      canManage: true,
    },
    {
      id: 3,
      name: "Chief Inspector",
      description: "Leads inspection teams and compliance verification",
      canManage: true,
    },
    {
      id: 4,
      name: "Procurement Officer",
      description: "Handles purchase requests and supplier records",
      canManage: true,
    },
    {
      id: 5,
      name: "Finance Controller",
      description: "Oversees financial activities and disbursements",
      canManage: true,
    },
    { id: 6, name: "Research Analyst", description: "Performs technical and scientific research", canManage: true },
    { id: 7, name: "ICT Administrator", description: "Manages ERP infrastructure and security", canManage: true },
    { id: 8, name: "Document Controller", description: "Manages documentation lifecycle", canManage: true },
  ];

  const permissions: Permission[] = [
    { id: 1, name: "manage_users", label: "Manage Users", category: "User Management" },
    { id: 2, name: "assign_roles", label: "Assign Roles", category: "User Management" },
    { id: 3, name: "reset_passwords", label: "Reset Passwords", category: "User Management" },
    { id: 4, name: "view_audit_logs", label: "View Audit Logs", category: "System" },
    { id: 5, name: "configure_system", label: "Configure System", category: "System" },
    { id: 6, name: "manage_departments", label: "Manage Departments", category: "System" },
    { id: 7, name: "approve_standards", label: "Approve Standards", category: "Standards" },
    { id: 8, name: "view_compliance", label: "View Compliance Reports", category: "Standards" },
    { id: 9, name: "create_inspection", label: "Create Inspection Schedule", category: "Inspection" },
    { id: 10, name: "update_inspection", label: "Update Inspection Status", category: "Inspection" },
    { id: 11, name: "upload_findings", label: "Upload Field Findings", category: "Inspection" },
    { id: 12, name: "create_procurement", label: "Create Procurement Request", category: "Procurement" },
    { id: 13, name: "view_suppliers", label: "View Supplier List", category: "Procurement" },
    { id: 14, name: "approve_payments", label: "Approve Payment Vouchers", category: "Finance" },
    { id: 15, name: "access_research", label: "Access Research Database", category: "Research" },
  ];

  const toggleRoleExpand = (roleId: number): void => {
    setExpandedRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  };

  const hasPermission = (roleId: number, permissionId: number): boolean => {
    return permissionMatrix[roleId]?.includes(permissionId) || false;
  };

  const togglePermission = (roleId: number, permissionId: number): void => {
    // Check if current user can grant permissions
    if (!canGrantPermissions(roleId)) {
      toast.error("Only System Administrator and Director of Standards can modify permissions");
      return;
    }

    setPermissionMatrix((prev) => {
      const currentPermissions = prev[roleId] || [];
      let updatedPermissions: number[];

      if (currentPermissions.includes(permissionId)) {
        // Revoke permission
        updatedPermissions = currentPermissions.filter((id) => id !== permissionId);
        toast.success(`Permission revoked from ${roles.find((r) => r.id === roleId)?.name}`);
      } else {
        // Grant permission
        updatedPermissions = [...currentPermissions, permissionId];
        toast.success(`Permission granted to ${roles.find((r) => r.id === roleId)?.name}`);
      }

      return {
        ...prev,
        [roleId]: updatedPermissions,
      };
    });
  };

  const groupedPermissions = permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
    const category = perm.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(perm);
    return acc;
  }, {});

  const categories = Object.keys(groupedPermissions).sort();
  const totalPermissions = categories.reduce((sum, cat) => sum + groupedPermissions[cat].length, 0);

  return (
    <div className="@container/main flex flex-col gap-4 space-y-2">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions Management</CardTitle>
          <CardDescription>
            Configure role-based access control (RBAC) across the SON ERP system.
            {roles.length} roles with {totalPermissions} permissions
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Permission Matrix</CardTitle>
          <CardDescription>Click on cells to grant or revoke permissions for editable roles</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto rounded-2xl px-0">
          <div className="inline-block min-w-full">
            {/* Header Row */}
            <div className="flex gap-0">
              {/* Corner Cell */}
              <div className="flex w-56 flex-shrink-0 items-center justify-center border border-slate-200 bg-slate-900 p-3 text-xs font-semibold text-white">
                Roles / Permissions
              </div>

              {/* Role Headers */}
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`flex min-h-20 w-32 flex-shrink-0 cursor-pointer flex-col items-center justify-center border border-slate-200 p-3 text-center text-xs font-semibold transition ${
                    role.canManage
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-default"
                  }`}
                  onClick={() => role.canManage && toggleRoleExpand(role.id)}
                  title={role.description}
                >
                  <div className="mb-1 line-clamp-2">{role.name}</div>
                  {role.canManage && (expandedRoles[role.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  {!role.canManage && <Lock size={14} />}
                </div>
              ))}
            </div>

            {/* Permission Rows */}
            {categories.map((category, categoryIndex) => (
              <div key={category} className="relative">
                {/* Category Header */}
                <div className="flex gap-0">
                  <div className="bg-secondary text-secondary-foreground w-56 flex-shrink-0 border border-slate-200 p-3 text-xs font-semibold tracking-wider uppercase">
                    {category}
                  </div>
                  {roles.map((role) => (
                    <div
                      key={`header-${role.id}-${category}`}
                      className="bg-secondary/30 w-32 flex-shrink-0 border border-slate-200"
                    />
                  ))}
                </div>

                {/* Permissions in Category */}
                {groupedPermissions[category].map((permission, permIndex) => (
                  <div key={permission.id} className="hover:bg-accent/50 flex gap-0 transition">
                    {/* Permission Name */}
                    <div className="text-foreground bg-background w-56 flex-shrink-0 border border-slate-200 p-3 text-xs font-medium">
                      {permission.label}
                    </div>

                    {/* Permission Cells */}
                    {roles.map((role) => {
                      const has = hasPermission(role.id, permission.id);
                      const isEditable = role.canManage;

                      return (
                        <div
                          key={`${role.id}-${permission.id}`}
                          className={`bg-background flex w-32 flex-shrink-0 items-center justify-center border border-slate-200 p-3 transition ${
                            isEditable
                              ? "hover:bg-accent/20 cursor-pointer active:scale-95"
                              : "cursor-not-allowed opacity-75"
                          }`}
                          onClick={() => isEditable && togglePermission(role.id, permission.id)}
                          title={
                            isEditable
                              ? `Click to ${has ? "revoke" : "grant"} permission`
                              : "This role cannot be modified"
                          }
                        >
                          {has ? (
                            <Badge className="flex cursor-pointer items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                              <Check size={14} />
                              <span className="text-xs">Granted</span>
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className={
                                isEditable
                                  ? "cursor-pointer border-red-200 text-red-600"
                                  : "text-muted-foreground border-muted"
                              }
                            >
                              <X size={14} />
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ Information:</strong> This matrix shows the permissions assigned to each role in the SON ERP
            system. Permissions can only be modified by authorized administrators. Click on role headers to view
            detailed role descriptions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesPermissionsMatrix;
