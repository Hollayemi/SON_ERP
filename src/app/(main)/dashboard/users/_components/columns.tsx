import type { Column, ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { AssignRoleDialog } from "./assign-role-dialog";
import { UserInfo } from "@/stores/services/types";

export const userColumns: ColumnDef<UserInfo>[] = [
  {
    id: "select",
    header: ({ table }: { table: import("@tanstack/react-table").Table<UserInfo> }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    header: ({ column }: { column: Column<UserInfo, unknown> }) => (
      <DataTableColumnHeader column={column} title="Staff Name" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      const fullName = `${user.first_name} ${user.last_name}`;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src="" alt={fullName} />
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{fullName}</span>
            <span className="text-muted-foreground text-sm">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone_number",
    header: ({ column }: { column: Column<UserInfo, unknown> }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-sm">{row.original.phone_number}</span>,
  },
  {
    accessorKey: "department",
    header: ({ column }: { column: Column<UserInfo, unknown> }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      const department = row.original.state_office_department?.department;
      return department ? (
        <div className="flex flex-col">
          <span className="font-medium">{department.name}</span>
          <span className="text-muted-foreground text-xs">{department.code}</span>
        </div>
      ) : (
        <span className="text-muted-foreground italic">No department</span>
      );
    },
  },
  {
    accessorKey: "state_office",
    header: ({ column }: { column: Column<UserInfo, unknown> }) => (
      <DataTableColumnHeader column={column} title="State Office" />
    ),
    cell: ({ row }) => {
      const stateOffice = row.original.state_office_department?.state_office;
      return stateOffice ? (
        <div className="flex flex-col">
          <span className="font-medium">{stateOffice.name}</span>
          <span className="text-muted-foreground text-xs">{stateOffice.state.name}</span>
        </div>
      ) : (
        <span className="text-muted-foreground italic">No office</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }: { column: Column<UserInfo, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "Active" ? "default" : "secondary"}>
          <span className={`mr-1 size-2 rounded-full ${status === "Active" ? "bg-green-500" : "bg-gray-500"}`} />
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }: { column: Column<UserInfo, unknown> }) => (
      <DataTableColumnHeader column={column} title="Date Joined" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <span className="text-muted-foreground text-sm tabular-nums">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <AssignRoleDialog
            user={{
              id: user.id,
              name: `${user.first_name} ${user.last_name}`,
              email: user.email,
            }}
            triggerVariant="ghost"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <EllipsisVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <Link href={`/dashboard/users/${user.id}`}>
                <DropdownMenuItem>
                  <Eye />
                  View Details
                </DropdownMenuItem>
              </Link>
              <Link href={`/dashboard/users/${user.id}/edit`}>
                <DropdownMenuItem>
                  <Edit />
                  Edit Record
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 />
                Remove Staff
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
  },
];
