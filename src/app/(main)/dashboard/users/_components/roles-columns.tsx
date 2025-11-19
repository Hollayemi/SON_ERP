import { ColumnDef } from "@tanstack/react-table";
import { Users } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { CreateRoleDialog } from "./create-role-dialog";
import { DeleteDialog } from "./delete-dialog";

export type Role = {
  id: number;
  name: string;
  permissions?: Array<{ id: number; name: string; description?: string }>;
  created_at?: string;
  updated_at?: string;
};

export const rolesColumns: ColumnDef<Role>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.name}</span>
        {row.original.name === "Admin" && (
          <Badge variant="secondary" className="text-xs">
            System
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "permissions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Permissions" />,
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.permissions?.length || 0} permissions
      </Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
    cell: ({ row }) => {
      const date = row.original.updated_at
        ? new Date(row.original.updated_at).toLocaleDateString()
        : "N/A";
      return <span className="text-muted-foreground tabular-nums">{date}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <CreateRoleDialog
          role={{
            id: row.original.id,
            name: row.original.name,
            permissions: row.original.permissions,
          }}
        />
        {row.original.name !== "Admin" && (
          <DeleteDialog
            type="role"
            item={{ id: row.original.id.toString(), name: row.original.name }}
            affectedCount={0}
          />
        )}
      </div>
    ),
    enableSorting: false,
  },
];