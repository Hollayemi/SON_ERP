"use client";

import { useState, useMemo } from "react";
import * as React from "react";
import { Settings, ChevronDown, ChevronRight, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { useGetPermissionsQuery, useAssignPermissionsMutation } from "@/stores/services/usersApi";

interface ManageRolePermissionsDialogProps {
  role: {
    id: number;
    name: string;
    permissions?: Array<{ id: number; name: string }>;
  };
  onSuccess?: () => void;
}

export function ManageRolePermissionsDialog({ role, onSuccess }: ManageRolePermissionsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(role.permissions?.map((p) => p.id) || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const { data: permissionsResponse, isLoading: loadingPermissions } = useGetPermissionsQuery();
  const [assignPermissions, { isLoading: isAssigning }] = useAssignPermissionsMutation();

  const permissions = permissionsResponse?.data || [];

  // Group permissions by module
  const permissionsByModule = useMemo(() => {
    const grouped: Record<string, typeof permissions> = {};

    permissions.forEach((permission: any) => {
      const moduleName = permission.name.split(".")[0] || "Other";
      if (!grouped[moduleName]) {
        grouped[moduleName] = [];
      }
      grouped[moduleName].push(permission);
    });

    return grouped;
  }, [permissions]);

  // Filter modules and permissions based on search
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return permissionsByModule;

    const filtered: Record<string, typeof permissions> = {};
    const query = searchQuery.toLowerCase();

    Object.entries(permissionsByModule).forEach(([module, perms]) => {
      const matchingPerms = perms.filter(
        (p: any) => p.name.toLowerCase().includes(query) || module.toLowerCase().includes(query),
      );

      if (matchingPerms.length > 0) {
        filtered[module] = matchingPerms;
      }
    });

    return filtered;
  }, [permissionsByModule, searchQuery]);

  // Auto-expand modules when searching
  React.useEffect(() => {
    if (searchQuery.trim()) {
      setExpandedModules(new Set(Object.keys(filteredModules)));
    }
  }, [searchQuery, filteredModules]);

  // Reset selected permissions when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setSelectedPermissions(role.permissions?.map((p) => p.id) || []);
      setSearchQuery("");
      // Expand first module by default
      if (Object.keys(permissionsByModule).length > 0) {
        setExpandedModules(new Set([Object.keys(permissionsByModule)[0]]));
      }
    } else {
      setExpandedModules(new Set());
    }
  };

  const toggleModule = (module: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(module)) {
        next.delete(module);
      } else {
        next.add(module);
      }
      return next;
    });
  };

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
    );
  };

  const toggleAllModulePermissions = (modulePerms: any[]) => {
    const modulePermIds = modulePerms.map((p) => p.id);
    const allSelected = modulePermIds.every((id) => selectedPermissions.includes(id));

    if (allSelected) {
      // Deselect all from this module
      setSelectedPermissions((prev) => prev.filter((id) => !modulePermIds.includes(id)));
    } else {
      // Select all from this module
      setSelectedPermissions((prev) => {
        const newIds = modulePermIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      });
    }
  };

  const handleSave = async () => {
    try {
      const result = await assignPermissions({
        role_id: role.id,
        permissions: selectedPermissions,
      }).unwrap();

      if (!result.success) {
        throw new Error(result.message || "Failed to update permissions");
      }

      toast.success("Permissions updated successfully", {
        description: `Updated permissions for ${role.name}`,
      });

      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Update permissions error:", error);
      toast.error(error?.message || "Failed to update permissions");
    }
  };

  const totalSelected = selectedPermissions.length;
  const totalPermissions = permissions.length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="hover:bg-secondary" size="sm">
          <Settings className="size-4" />
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[85vh] max-w-4xl flex-col p-0">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">Manage Permissions for {role.name}</DialogTitle>
          <DialogDescription>Select permissions from different modules to assign to this role</DialogDescription>

          {/* Summary Stats */}
          <div className="flex items-center gap-4 pt-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600" />
              <span className="text-sm font-medium">
                {totalSelected} of {totalPermissions} selected
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <Badge variant="outline" className="font-normal">
              {Object.keys(filteredModules).length} modules
            </Badge>
          </div>
        </DialogHeader>

        {/* Search Bar */}
        <div className="bg-muted/30 border-b px-6 py-3">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search permissions or modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background pl-9"
            />
          </div>
        </div>

        {loadingPermissions ? (
          <div className="flex-1 space-y-3 px-6 py-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <ScrollArea className="flex-1 overflow-auto px-6">
            <div className="space-y-2 py-4">
              {Object.entries(filteredModules).map(([module, modulePermissions]) => {
                const isExpanded = expandedModules.has(module);
                const selectedInModule = modulePermissions.filter((p: any) =>
                  selectedPermissions.includes(p.id),
                ).length;
                const totalInModule = modulePermissions.length;
                const allSelected = selectedInModule === totalInModule;
                const someSelected = selectedInModule > 0 && selectedInModule < totalInModule;

                return (
                  <Collapsible
                    key={module}
                    open={isExpanded}
                    onOpenChange={() => toggleModule(module)}
                    className="overflow-auto rounded-lg border"
                  >
                    <CollapsibleTrigger className="hover:bg-secondary/50 w-full transition-colors">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="text-muted-foreground size-4" />
                            ) : (
                              <ChevronRight className="text-muted-foreground size-4" />
                            )}
                            <Checkbox
                              checked={allSelected}
                              ref={(el) => {
                                if (el) {
                                  (el as HTMLInputElement).indeterminate = someSelected;
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAllModulePermissions(modulePermissions);
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-medium capitalize">
                              {module.split("_").join(" ")}
                            </Badge>
                            <span className="text-muted-foreground text-sm">
                              {totalInModule} permission{totalInModule !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {selectedInModule > 0 && (
                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                              {selectedInModule} selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="bg-muted/20 border-t">
                        <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2">
                          {modulePermissions.map((permission: any) => (
                            <div
                              key={permission.id}
                              className="bg-background hover:bg-secondary/30 flex cursor-pointer items-start space-x-3 rounded-md border p-3 transition-colors"
                              onClick={() => togglePermission(permission.id)}
                            >
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={selectedPermissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="min-w-0 flex-1 space-y-1">
                                <label
                                  htmlFor={`permission-${permission.id}`}
                                  className="block cursor-pointer text-sm leading-none font-medium"
                                >
                                  {permission.name.split(".")[1]?.split("_").join(" ") || permission.name}
                                </label>
                                {permission.description && (
                                  <p className="text-muted-foreground line-clamp-2 text-xs">{permission.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}

              {Object.keys(filteredModules).length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground text-sm">
                    {searchQuery ? "No permissions found matching your search" : "No permissions available"}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="bg-muted/30 border-t px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {totalSelected > 0 && (
                <span>
                  {totalSelected} permission{totalSelected !== 1 ? "s" : ""} will be assigned
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isAssigning}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isAssigning || loadingPermissions}>
                {isAssigning ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
