"use client";

import { useState } from "react";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserCog } from "lucide-react";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { useAssignRoleMutation, useGetRolesQuery } from "@/stores/services/usersApi";

const assignRoleSchema = z.object({
    roles: z.array(z.number()).min(1, "Please select at least one role"),
});

type AssignRoleFormData = z.infer<typeof assignRoleSchema>;

interface AssignRoleDialogProps {
    user: {
        id: number;
        name?: string;
        email?: string;
        roles?: Array<{ id: number; name: string }>;
    };
    onSuccess?: () => void;
    triggerVariant?: "default" | "ghost" | "outline";
}

export function AssignRoleDialog({ user, onSuccess, triggerVariant = "ghost" }: AssignRoleDialogProps) {
    const [open, setOpen] = useState(false);

    const { data: rolesResponse, isLoading: loadingRoles } = useGetRolesQuery();
    const [assignRole, { isLoading: isAssigning }] = useAssignRoleMutation();

    const roles = rolesResponse?.data || [];
    const isLoading = isAssigning;

    const form = useForm<AssignRoleFormData>({
        resolver: zodResolver(assignRoleSchema),
        defaultValues: {
            roles: user.roles?.map((r) => r.id) || [],
        },
    });

    // Reset form when dialog opens
    React.useEffect(() => {
        if (open) {
            form.reset({
                roles: user.roles?.map((r) => r.id) || [],
            });
        }
    }, [open, user, form]);

    const onSubmit = async (data: AssignRoleFormData) => {
        try {
            const result = await assignRole({
                user_id: user.id,
                role: data.roles,
            }).unwrap();

            if (!result.success) {
                throw new Error(result.message || "Failed to assign roles");
            }

            toast.success("Roles assigned successfully", {
                description: `Updated roles for ${user.name || user.email}`,
            });

            setOpen(false);
            onSuccess?.();
        } catch (error: any) {
            console.error("Assign role error:", error);
            toast.error(error?.message || "An error occurred while assigning roles");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={triggerVariant} size="sm">
                    <UserCog className="size-4" />
                    Assign Roles
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Assign Roles</DialogTitle>
                    <DialogDescription>
                        Select the roles to assign to {user.name || user.email}
                    </DialogDescription>
                </DialogHeader>

                {loadingRoles ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-muted-foreground text-sm">Loading roles...</div>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="roles"
                                render={() => (
                                    <FormItem>
                                        <ScrollArea className="rounded-md border p-4 max-h-[400px]">
                                            <div className="space-y-4">
                                                {roles.length === 0 ? (
                                                    <div className="text-center py-8">
                                                        <p className="text-muted-foreground text-sm">No roles available</p>
                                                    </div>
                                                ) : (
                                                    roles.map((role: any) => (
                                                        <FormField
                                                            key={role.id}
                                                            control={form.control}
                                                            name="roles"
                                                            render={({ field }) => (
                                                                <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(role.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                const newValue = checked
                                                                                    ? [...(field.value || []), role.id]
                                                                                    : (field.value || []).filter((id) => id !== role.id);
                                                                                field.onChange(newValue);
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <div className="space-y-1 leading-none flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <FormLabel className="font-medium">{role.name}</FormLabel>
                                                                            {role.name === "Admin" && (
                                                                                <Badge variant="secondary" className="text-xs">
                                                                                    System
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        {role.permissions && role.permissions.length > 0 && (
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {role.permissions.length} permission{role.permissions.length !== 1 ? "s" : ""}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    ))
                                                )}
                                            </div>
                                        </ScrollArea>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Assigning..." : "Assign Roles"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}