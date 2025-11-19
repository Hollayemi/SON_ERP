"use client";

import { useState } from "react";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { z } from "zod";

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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useAssignPermissionsMutation,
  useRevokePermissionsMutation
} from "@/stores/services/usersApi";

const createRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  permissions: z.array(z.number()).optional(),
});

type RoleFormData = z.infer<typeof createRoleSchema>;

interface CreateRoleDialogProps {
  role?: {
    id: number;
    name: string;
    permissions?: Array<{ id: number; name: string }>;
  } | null;
  permissions?: Array<{ id: number; name: string; description?: string }>;
  onSuccess?: () => void;
}

export function CreateRoleDialog({ role, permissions = [], onSuccess }: CreateRoleDialogProps) {
  const [open, setOpen] = useState(false);

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [assignPermissions, { isLoading: isAssigning }] = useAssignPermissionsMutation();
  const [revokePermissions, { isLoading: isRevoking }] = useRevokePermissionsMutation();

  const isLoading = isCreating || isUpdating || isAssigning || isRevoking;

  const form = useForm<RoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: role?.name || "",
      permissions: role?.permissions?.map((p) => p.id) || [],
    },
  });

  // Reset form when role changes or dialog opens
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: role?.name || "",
        permissions: role?.permissions?.map((p) => p.id) || [],
      });
    }
  }, [open, role, form]);

  const onSubmit = async (data: RoleFormData) => {
    try {
      if (role) {
        // UPDATE EXISTING ROLE

        // 1. Update role name
        const updateResult = await updateRole({
          id: role.id,
          name: data.name,
        }).unwrap();

        if (!updateResult.success) {
          throw new Error(updateResult.message || "Failed to update role");
        }

        // 2. Handle permissions changes
        const oldPermissionIds = role.permissions?.map(p => p.id) || [];
        const newPermissionIds = data.permissions || [];

        // Permissions to add (in new but not in old)
        const toAdd = newPermissionIds.filter(id => !oldPermissionIds.includes(id));

        // Permissions to revoke (in old but not in new)
        const toRevoke = oldPermissionIds.filter(id => !newPermissionIds.includes(id));

        // Assign new permissions
        if (toAdd.length > 0) {
          await assignPermissions({
            role_id: role.id,
            permissions: toAdd,
          }).unwrap();
        }

        // Revoke removed permissions
        if (toRevoke.length > 0) {
          await revokePermissions({
            role_id: role.id,
            permissions: toRevoke,
          }).unwrap();
        }

        toast.success("Role updated successfully");
      } else {
        // CREATE NEW ROLE

        // 1. Create role first
        const createResult = await createRole({ name: data.name }).unwrap();

        if (!createResult.success || !createResult.data) {
          throw new Error(createResult.message || "Failed to create role");
        }

        // 2. Assign permissions if any selected
        if (data.permissions && data.permissions.length > 0) {
          await assignPermissions({
            role_id: createResult.data.id,
            permissions: data.permissions,
          }).unwrap();
        }

        toast.success("Role created successfully");
      }

      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Role operation error:", error);
      toast.error(error?.message || "An error occurred");
    }
  };

  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, permission) => {
    const moduleName = permission.name.split(".")[0] || "Other";

    if (!acc[moduleName]) {
      acc[moduleName] = [];
    }

    acc[moduleName].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="sticky top-0">
        {role ? (
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        ) : (
          <Button size="sm">
            <Plus />
            Create Role
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="!max-h-[90vh] max-w-2xl overflow-auto">
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Create New Role"}</DialogTitle>
          <DialogDescription>
            {role ? "Update role details and permissions" : "Define a new role with specific permissions"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Senior Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {permissions.length > 0 && (
              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Permissions</FormLabel>
                      <FormDescription>Select the permissions to assign to this role</FormDescription>
                    </div>
                    <ScrollArea className="rounded-md border p-4 max-h-[400px]">
                      <div className="space-y-4">
                        {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                          <div key={module} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">
                                {module.split("_").join(" ")}
                              </Badge>
                              <Separator className="flex-1" />
                            </div>
                            <div className="space-y-2">
                              {modulePermissions.map((permission) => (
                                <FormField
                                  key={permission.id}
                                  control={form.control}
                                  name="permissions"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(permission.id)}
                                          onCheckedChange={(checked) => {
                                            const newValue = checked
                                              ? [...(field.value || []), permission.id]
                                              : (field.value || []).filter((id) => id !== permission.id);
                                            field.onChange(newValue);
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel className="font-medium">
                                          {permission.name.split(".")[1]?.split("_").join(" ") || permission.name}
                                        </FormLabel>
                                        {permission.description && (
                                          <FormDescription className="text-xs">
                                            {permission.description}
                                          </FormDescription>
                                        )}
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (role ? "Updating..." : "Creating...") : role ? "Update Role" : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}