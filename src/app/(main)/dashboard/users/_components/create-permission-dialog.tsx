"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus } from "lucide-react";

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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { createPermissionSchema, PermissionFormData } from "./schema";
import { moduleOptions } from "./data";
import { Permission } from "@/types/roles-permissions";

interface CreatePermissionDialogProps {
    permission?: Permission | null;
    onSuccess?: () => void;
}

export function CreatePermissionDialog({ permission, onSuccess }: CreatePermissionDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<PermissionFormData>({
        resolver: zodResolver(createPermissionSchema),
        defaultValues: {
            name: permission?.name || "",
            description: permission?.description || "",
            module: permission?.module || "",
        },
    });

    const onSubmit = async (data: PermissionFormData) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success(
                permission ? "Permission updated successfully" : "Permission created successfully",
                {
                    description: `${data.name} in ${data.module} module has been ${permission ? "updated" : "created"}.`,
                }
            );

            setOpen(false);
            form.reset();
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to save permission", {
                description: "Please try again later.",
            });
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
                    <DialogTitle>
                        {permission ? "Edit Permission" : "Create New Permission"}
                    </DialogTitle>
                    <DialogDescription>
                        {permission
                            ? "Update permission details"
                            : "Define a new permission for the system"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permission Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Delete Reports" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                            {moduleOptions.map((module) => (
                                                <SelectItem key={module} value={module}>
                                                    {module}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                            placeholder="Describe what this permission allows"
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
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