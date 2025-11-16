"use client";

import { useState } from "react";
import { Check, X, Save, Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { mockRoles, mockPermissions } from "./data";
import { Role, Permission } from "@/types/tableColumns";

export function PermissionsMatrix() {
  const [matrixData, setMatrixData] = useState(() => {
    // Initialize matrix with current role permissions
    const matrix: Record<string, Set<string>> = {};
    mockRoles.forEach((role) => {
      matrix[role.id] = new Set(role.permissions);
    });
    return matrix;
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Group permissions by module
  const permissionsByModule = mockPermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  const togglePermission = (roleId: string, permissionId: string) => {
    setMatrixData((prev) => {
      const newMatrix = { ...prev };
      const rolePermissions = new Set(newMatrix[roleId]);

      if (rolePermissions.has(permissionId)) {
        rolePermissions.delete(permissionId);
      } else {
        rolePermissions.add(permissionId);
      }

      newMatrix[roleId] = rolePermissions;
      setHasChanges(true);
      return newMatrix;
    });
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Permissions updated successfully", {
        description: "All role permissions have been saved.",
      });

      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to save permissions", {
        description: "Please try again later.",
      });
    }
  };

  const handleReset = () => {
    const matrix: Record<string, Set<string>> = {};
    mockRoles.forEach((role) => {
      matrix[role.id] = new Set(role.permissions);
    });
    setMatrixData(matrix);
    setHasChanges(false);
    toast.info("Changes discarded");
  };

  const getPermissionCount = (roleId: string) => {
    return matrixData[roleId]?.size || 0;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permissions Matrix</CardTitle>
              <CardDescription>Manage role permissions in a visual matrix format</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Discard Changes
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {hasChanges && (
            <Alert className="mb-4">
              <Info className="size-4" />
              <AlertDescription>
                You have unsaved changes. Click <strong>Save Changes</strong> to apply them.
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border">
            <ScrollArea className="h-[600px]">
              <div className="">
                {/* Header Row with Role Names */}
                <div className="bg-muted/50 sticky top-0 z-20 backdrop-blur">
                  <div
                    className="grid overflow-x-auto"
                    style={{
                      gridAutoFlow: "column",
                      gridTemplateColumns: "250px repeat(auto-fit, minmax(150px, 1fr))",
                    }}
                  >
                    {/* Empty corner cell */}
                    <div className="border-r border-b p-3">
                      <span className="text-sm font-medium">Permissions / Roles</span>
                    </div>

                    {/* Role headers */}
                    {mockRoles.map((role) => (
                      <div key={role.id} className="border-r border-b p-3 text-center last:border-r-0">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="space-y-1">
                                <div className="flex items-center justify-center gap-2">
                                  <span className="text-sm font-medium">{role.name}</span>
                                  {role.name === "Administrator" && (
                                    <Badge variant="secondary" className="text-xs">
                                      System
                                    </Badge>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {getPermissionCount(role.id)} perms
                                </Badge>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{role.description}</p>
                              <p className="text-muted-foreground mt-1 text-xs">{role.userCount} users assigned</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Permission Rows Grouped by Module */}
                {Object.entries(permissionsByModule).map(([module, permissions], moduleIndex) => (
                  <div key={module}>
                    {/* Module Header */}
                    <div className="bg-accent/50 sticky z-10 border-b" style={{ top: "60px" }}>
                      <div
                        className="grid overflow-x-auto"
                        style={{
                          gridAutoFlow: "column",
                          gridTemplateColumns: "250px repeat(auto-fit, minmax(150px, 1fr))",
                        }}
                      >
                        <div className="border-r p-2">
                          <Badge variant="default">{module}</Badge>
                        </div>
                        <div className="col-span-full"></div>
                      </div>
                    </div>

                    {/* Permission Rows */}
                    {permissions.map((permission, permIndex) => (
                      <div
                        key={permission.id}
                        className="hover:bg-muted/50 grid"
                        style={{ gridTemplateColumns: "250px repeat(auto-fit, minmax(150px, 1fr))" }}
                      >
                        {/* Permission Name */}
                        <div className="border-r border-b p-3">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-help">
                                  <span className="text-sm font-medium">{permission.name}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <p className="text-xs">{permission.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        {/* Checkboxes for each role */}
                        {mockRoles.map((role) => {
                          const hasPermission = matrixData[role.id]?.has(permission.id);
                          const isSystemRole = role.name === "Administrator";

                          return (
                            <div key={`${role.id}-${permission.id}`} className="border-r border-b p-3 last:border-r-0">
                              <div className="flex items-center justify-center">
                                <Checkbox
                                  checked={hasPermission}
                                  disabled={isSystemRole}
                                  onCheckedChange={() => togglePermission(role.id, permission.id)}
                                  className="size-5"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Legend */}
          <div className="text-muted-foreground mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Check className="size-4 text-green-500" />
              <span>Permission granted</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="text-muted-foreground size-4" />
              <span>Permission not granted</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                System
              </Badge>
              <span>Protected role (cannot be modified)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
