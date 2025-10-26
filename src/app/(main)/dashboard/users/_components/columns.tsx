import { ColumnDef } from "@tanstack/react-table";
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

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  status: "Active" | "Inactive";
  joinedDate: string;
  phone?: string;
  address?: string;
};

// Color-coding roles for SON ERP staff
const roleColors: Record<string, string> = {
  "Director of Standards": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Chief Inspector": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Procurement Officer": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Finance Controller": "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  "Research Analyst": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  "ICT Administrator": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "Public Relations Officer": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "Document Controller": "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  "Quality Control Officer": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  "Audit Supervisor": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Legal Adviser": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Senior Data Analyst": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Staff Name" />,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-muted-foreground text-sm">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role / Position" />,
    cell: ({ row }) => {
      const role = row.original.role;
      const colorClass = roleColors[role] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      return (
        <Badge variant="outline" className={`${colorClass} border-0 font-medium`}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.department}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employment Status" />,
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
    accessorKey: "joinedDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date Joined" />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.joinedDate}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
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
      );
    },
    enableSorting: false,
  },
];
