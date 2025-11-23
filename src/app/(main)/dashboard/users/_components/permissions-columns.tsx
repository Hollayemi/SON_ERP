import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { CreatePermissionDialog } from "./create-permission-dialog";
import { DeleteDialog } from "./delete-dialog";

export type Permission = {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
};

export const permissionsColumns: ColumnDef<Permission>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Permission Name" />,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "module",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Module" />,
    cell: ({ row }) => {
      // Extract module from permission name (e.g., "users.create" -> "users")
      const mod = row.original.name.split(".")[0] || "Other";
      return (
        <Badge variant="outline" className="capitalize">
          {mod}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground max-w-md truncate">{row.original.description || "No description"}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const date = row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : "N/A";
      return <span className="text-muted-foreground tabular-nums">{date}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <CreatePermissionDialog
          permission={{
            id: row.original.id,
            name: row.original.name,
          }}
        />
        <DeleteDialog
          type="permission"
          item={{ id: row.original.id.toString(), name: row.original.name }}
          affectedCount={0}
        />
      </div>
    ),
    enableSorting: false,
  },
];
