import { ColumnDef } from "@tanstack/react-table";
import { Users } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Role } from "@/types/roles-permissions";
import { CreateRoleDialog } from "./create-role-dialog";
import { DeleteDialog } from "./delete-dialog";

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
        {row.original.name === "Administrator" && (
          <Badge variant="secondary" className="text-xs">
            System
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => <span className="text-muted-foreground max-w-md truncate">{row.original.description}</span>,
  },
  {
    accessorKey: "permissions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Permissions" />,
    cell: ({ row }) => <Badge variant="outline">{row.original.permissions.length} permissions</Badge>,
    enableSorting: false,
  },
  {
    accessorKey: "userCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Users" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Users className="text-muted-foreground size-4" />
        <span className="tabular-nums">{row.original.userCount}</span>
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.updatedAt}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <CreateRoleDialog role={row.original} />
        {row.original.name !== "Administrator" && (
          <DeleteDialog
            type="role"
            item={{ id: row.original.id, name: row.original.name }}
            affectedCount={row.original.userCount}
          />
        )}
      </div>
    ),
    enableSorting: false,
  },
];
