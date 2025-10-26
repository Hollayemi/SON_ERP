"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus } from "lucide-react";

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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { createRoleSchema, RoleFormData } from "./schema";
import { mockPermissions } from "./data";
import { Role } from "@/types/roles-permissions";

interface CreateRoleDialogProps {
    role?: Role | null;
    onSuccess?: () => void;
}

export function CreateRoleDialog({ role, onSuccess }: CreateRoleDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<RoleFormData>({
        resolver: zodResolver(createRoleSchema),
        defaultValues: {
            name: role?.name || "",
            description: role?.description || "",
            permissions: role?.permissions || [],
        },
    });

    const onSubmit = async (data: RoleFormData) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success(role ? "Role updated successfully" : "Role created successfully", {
                description: `${data.name} has been ${role ? "updated" : "created"} with ${data.permissions.length} permissions.`,
            });

            setOpen(false);
            form.reset();
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to save role", {
                description: "Please try again later.",
            });
        }
    };

    // Group permissions by module
    const permissionsByModule = mockPermissions.reduce((acc, permission) => {
        if (!acc[permission.module]) {
            acc[permission.module] = [];
        }
        acc[permission.module].push(permission);
        return acc;
    }, {} as Record<string, typeof mockPermissions>);

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
            <DialogContent className="max-w-2xl !max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>{role ? "Edit Role" : "Create New Role"}</DialogTitle>
                    <DialogDescription>
                        {role
                            ? "Update role details and permissions"
                            : "Define a new role with specific permissions"}
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

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the role and its responsibilities"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="permissions"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Permissions</FormLabel>
                                        <FormDescription>
                                            Select the permissions to assign to this role
                                        </FormDescription>
                                    </div>
                                    <ScrollArea className=" rounded-md border p-4">
                                        <div className="space-y-4">
                                            {Object.entries(permissionsByModule).map(([module, permissions]) => (
                                                <div key={module} className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline">{module}</Badge>
                                                        <Separator className="flex-1" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        {permissions.map((permission) => (
                                                            <FormField
                                                                key={permission.id}
                                                                control={form.control}
                                                                name="permissions"
                                                                render={({ field }) => (
                                                                    <FormItem
                                                                        key={permission.id}
                                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                                    >
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(permission.id)}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([...field.value, permission.id])
                                                                                        : field.onChange(
                                                                                            field.value?.filter(
                                                                                                (value) => value !== permission.id
                                                                                            )
                                                                                        );
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <div className="space-y-1 leading-none">
                                                                            <FormLabel className="font-medium">
                                                                                {permission.name}
                                                                            </FormLabel>
                                                                            <FormDescription className="text-xs">
                                                                                {permission.description}
                                                                            </FormDescription>
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

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting
                                    ? role
                                        ? "Updating..."
                                        : "Creating..."
                                    : role
                                        ? "Update Role"
                                        : "Create Role"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}