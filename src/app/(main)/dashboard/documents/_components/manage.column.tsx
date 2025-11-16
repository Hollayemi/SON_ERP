"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Download, Trash2, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Document } from "../types";

export const manageColumns = (
  getFileIcon: any,
  handleDelete: any,
  handleDownload: any,
  handleView: any,
): ColumnDef<Document>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Document" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {getFileIcon(row.original.fileType)}
        <div>
          <div className="font-medium">{row.getValue("title")}</div>
          <div className="text-muted-foreground text-xs">{row.original.fileName}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
  },
  {
    accessorKey: "relatedTo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Related To" />,
    cell: ({ row }) => {
      const relatedTo = row.getValue("relatedTo") as string | undefined;
      return relatedTo ? (
        <div className="font-mono text-sm">{relatedTo}</div>
      ) : (
        <span className="text-muted-foreground italic">-</span>
      );
    },
  },
  {
    accessorKey: "fileSize",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Size" />,
    cell: ({ row }) => <div className="text-sm">{row.getValue("fileSize")} KB</div>,
  },
  {
    accessorKey: "version",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Version" />,
    cell: ({ row }) => <Badge variant="outline">v{row.getValue("version")}</Badge>,
  },
  {
    accessorKey: "uploadedBy",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Uploaded By" />,
    cell: ({ row }) => <div className="text-sm">{row.getValue("uploadedBy")}</div>,
  },
  {
    accessorKey: "uploadedDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("uploadedDate"));
      return (
        <div className="text-muted-foreground text-sm">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleView(row.original.id)}>
            <Eye className="mr-2 size-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload(row.original)}>
            <Download className="mr-2 size-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
