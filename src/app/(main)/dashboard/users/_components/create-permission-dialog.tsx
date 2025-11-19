"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useCreatePermissionMutation, useUpdatePermissionMutation } from "@/stores/services/usersApi";

// Available modules in the system
const MODULES = [
  { value: "users", label: "Users" },
  { value: "roles", label: "Roles" },
  { value: "permissions", label: "Permissions" },
  { value: "requests", label: "Requests" },
  { value: "approvals", label: "Approvals" },
  { value: "procurement", label: "Procurement" },
  { value: "finance", label: "Finance" },
  { value: "documents", label: "Documents" },
  { value: "reports", label: "Reports" },
  { value: "notifications", label: "Notifications" },
  { value: "dashboard", label: "Dashboard" },
  { value: "settings", label: "Settings" },
  { value: "audit", label: "Audit Trail" },
];

// Available actions for permissions
const ACTIONS = [
  { value: "view", label: "View" },
  { value: "create", label: "Create" },
  { value: "edit", label: "Edit" },
  { value: "delete", label: "Delete" },
  { value: "approve", label: "Approve" },
  { value: "reject", label: "Reject" },
  { value: "export", label: "Export" },
  { value: "import", label: "Import" },
  { value: "manage", label: "Manage" },
];

const createPermissionSchema = z.object({
  module: z.string().min(1, "Please select a module"),
  action: z.string().min(1, "Please select an action"),
});

type PermissionFormData = z.infer<typeof createPermissionSchema>;

interface CreatePermissionDialogProps {
  permission?: {
    id: number;
    name: string;
  } | null;
  onSuccess?: () => void;
}

export function CreatePermissionDialog({ permission, onSuccess }: CreatePermissionDialogProps) {
  const [open, setOpen] = useState(false);

  const [createPermission, { isLoading: isCreating }] = useCreatePermissionMutation();
  const [updatePermission, { isLoading: isUpdating }] = useUpdatePermissionMutation();

  const isLoading = isCreating || isUpdating;

  // Parse existing permission name into module and action
  const parsePermissionName = (name: string) => {
    const parts = name.split(".");
    return {
      module: parts[0] || "",
      action: parts[1] || "",
    };
  };

  const defaultValues = permission
    ? parsePermissionName(permission.name)
    : { module: "", action: "" };

  const form = useForm<PermissionFormData>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues,
  });

  const onSubmit = async (data: PermissionFormData) => {
    try {
      // Construct permission name as "module.action"
      const permissionName = `${data.module}.${data.action}`;

      if (permission) {
        // UPDATE EXISTING PERMISSION
        const result = await updatePermission({
          id: permission.id,
          name: permissionName,
        }).unwrap();

        if (!result.success) {
          throw new Error(result.message || "Failed to update permission");
        }

        toast.success("Permission updated successfully");
      } else {
        // CREATE NEW PERMISSION
        const result = await createPermission({ name: permissionName }).unwrap();

        if (!result.success) {
          throw new Error(result.message || "Failed to create permission");
        }

        toast.success("Permission created successfully");
      }

      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Permission operation error:", error);
      toast.error(error?.message || "An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {permission ? (
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        ) : (
          <Button size="sm" variant="outline">
            <Plus />
            Create Permission
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{permission ? "Edit Permission" : "Create New Permission"}</DialogTitle>
          <DialogDescription>
            {permission
              ? "Update the module and action for this permission"
              : "Select a module and action to create a new permission"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="module"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Module</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a module" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MODULES.map((module) => (
                        <SelectItem key={module.value} value={module.value}>
                          {module.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The system module this permission applies to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an action" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACTIONS.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The action that will be allowed with this permission
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview of the permission name */}
            {form.watch("module") && form.watch("action") && (
              <div className="rounded-md border bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Permission Name Preview:</p>
                <code className="text-sm font-mono font-semibold">
                  {form.watch("module")}.{form.watch("action")}
                </code>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? permission
                    ? "Updating..."
                    : "Creating..."
                  : permission
                    ? "Update Permission"
                    : "Create Permission"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}