import { z } from "zod";

export const roleSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    permissions: z.array(z.string()),
    userCount: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const permissionSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    module: z.string(),
    createdAt: z.string(),
});

export const createRoleSchema = z.object({
    name: z.string().min(2, "Role name must be at least 2 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export const createPermissionSchema = z.object({
    name: z.string().min(2, "Permission name must be at least 2 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    module: z.string().min(2, "Module name is required"),
});

export type RoleFormData = z.infer<typeof createRoleSchema>;
export type PermissionFormData = z.infer<typeof createPermissionSchema>;