import { ColumnDef, Column } from "@tanstack/react-table";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { POStatus, PurchaseOrder } from "@/types/tableColumns";
import { statusColors } from "@/config/app-config";

export const POColumns = (router: any): ColumnDef<PurchaseOrder>[] => [
  {
    accessorKey: "poNumber",
    header: ({ column }: { column: Column<PurchaseOrder> }) => (
      <DataTableColumnHeader column={column} title="PO Number" />
    ),
    cell: ({ row }) => <div className="font-mono font-medium">{row.getValue("poNumber")}</div>,
  },
  {
    accessorKey: "requestId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Request ID" />,
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("requestId")}</div>,
  },
  {
    accessorKey: "vendorName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Vendor" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("vendorName")}</div>,
  },
  {
    accessorKey: "itemName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Item" />,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Qty" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Amount" />,
    cell: ({ row }) => <div className="font-medium">₦{(row.getValue("totalAmount") as number).toLocaleString()}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as POStatus;
      return (
        <Badge variant="outline" className={statusColors[status]}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "deliveryDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Delivery Date" />,
    cell: ({ row }) => {
      const date = row.getValue("deliveryDate") as string | undefined;
      if (!date) return <span className="text-muted-foreground italic">Not set</span>;
      return (
        <div className="text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
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
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => router.push(`/dashboard/procurement/purchase-orders/${row.original.id}`)}
        >
          <Eye className="size-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Download className="size-4" />
        </Button>
      </div>
    ),
  },
];
