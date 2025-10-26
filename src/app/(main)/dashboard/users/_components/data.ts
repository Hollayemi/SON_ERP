import { Role, Permission } from "@/types/roles-permissions";

export const mockPermissions: Permission[] = [
    {
        id: "perm-1",
        name: "Create Requests",
        description: "Ability to create new requests in the system",
        module: "Requests",
        createdAt: "2024-01-15",
    },
    {
        id: "perm-2",
        name: "View Requests",
        description: "View all requests in the system",
        module: "Requests",
        createdAt: "2024-01-15",
    },
    {
        id: "perm-3",
        name: "Approve Requests",
        description: "Approve or reject requests",
        module: "Approvals",
        createdAt: "2024-01-15",
    },
    {
        id: "perm-4",
        name: "Manage Procurement",
        description: "Full access to procurement module",
        module: "Procurement",
        createdAt: "2024-01-15",
    },
    {
        id: "perm-5",
        name: "View Reports",
        description: "Access to view all system reports",
        module: "Reports",
        createdAt: "2024-01-15",
    },
    {
        id: "perm-6",
        name: "Manage Users",
        description: "Create, edit, and delete users",
        module: "User Management",
        createdAt: "2024-01-15",
    },
    {
        id: "perm-7",
        name: "Manage Roles",
        description: "Create, edit, and delete roles",
        module: "User Management",
        createdAt: "2024-01-15",
    },
    {
        id: "perm-8",
        name: "Process Payments",
        description: "Process and approve payments",
        module: "Finance",
        createdAt: "2024-01-15",
    },
];

export const mockRoles: Role[] = [
    {
        id: "role-1",
        name: "Administrator",
        description: "Full system access with all permissions",
        permissions: ["perm-1", "perm-2", "perm-3", "perm-4", "perm-5", "perm-6", "perm-7", "perm-8"],
        userCount: 3,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-10",
    },
    {
        id: "role-2",
        name: "Manager",
        description: "Department manager with approval rights",
        permissions: ["perm-1", "perm-2", "perm-3", "perm-5"],
        userCount: 8,
        createdAt: "2024-01-12",
        updatedAt: "2024-01-15",
    },
    {
        id: "role-3",
        name: "Staff",
        description: "Regular staff member with basic access",
        permissions: ["perm-1", "perm-2"],
        userCount: 45,
        createdAt: "2024-01-12",
        updatedAt: "2024-01-12",
    },
    {
        id: "role-4",
        name: "Procurement Officer",
        description: "Handles procurement and vendor management",
        permissions: ["perm-2", "perm-4", "perm-5"],
        userCount: 5,
        createdAt: "2024-01-14",
        updatedAt: "2024-01-14",
    },
    {
        id: "role-5",
        name: "Finance Officer",
        description: "Manages financial operations and payments",
        permissions: ["perm-2", "perm-5", "perm-8"],
        userCount: 4,
        createdAt: "2024-01-14",
        updatedAt: "2024-01-14",
    },
];

export const moduleOptions = [
    "Requests",
    "Approvals",
    "Procurement",
    "Finance",
    "Reports",
    "User Management",
    "Documents",
    "Audit Trail",
];