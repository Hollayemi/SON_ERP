"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
    ShoppingCart,
    Package,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Plus,
    Eye,
    Download,
    TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

// Types
type ProcurementStatus = "PENDING" | "IN_PROGRESS" | "SOURCED" | "DELIVERED" | "CANCELLED";

interface ProcurementRequest {
    id: string;
    requestNumber: string;
    itemName: string;
    quantity: number;
    department: string;
    approvedBy: string;
    approvedDate: string;
    status: ProcurementStatus;
    assignedTo?: string;
}

interface Vendor {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    category: string;
    rating: number;
    totalOrders: number;
    status: "ACTIVE" | "INACTIVE";
}

interface PurchaseOrder {
    id: string;
    poNumber: string;
    requestId: string;
    vendorName: string;
    totalAmount: number;
    status: "DRAFT" | "SENT" | "CONFIRMED" | "DELIVERED";
    createdDate: string;
    deliveryDate?: string;
}

// Mock Data
const mockPendingRequests: ProcurementRequest[] = [
    {
        id: "1",
        requestNumber: "REQ-2024-001",
        itemName: "Desktop Computers",
        quantity: 3,
        department: "IT Department",
        approvedBy: "DG SON",
        approvedDate: "2024-01-25",
        status: "PENDING",
    },
    {
        id: "2",
        requestNumber: "REQ-2024-005",
        itemName: "Office Chairs",
        quantity: 10,
        department: "Administration",
        approvedBy: "DG SON",
        approvedDate: "2024-01-26",
        status: "IN_PROGRESS",
        assignedTo: "John Procurement",
    },
];

const mockVendors: Vendor[] = [
    {
        id: "1",
        name: "TechHub Nigeria",
        contactPerson: "Adebayo Johnson",
        email: "info@techhub.ng",
        phone: "+234 801 234 5678",
        category: "IT Equipment",
        rating: 4.5,
        totalOrders: 25,
        status: "ACTIVE",
    },
    {
        id: "2",
        name: "Office Essentials Ltd",
        contactPerson: "Mary Okafor",
        email: "sales@officeessentials.ng",
        phone: "+234 802 345 6789",
        category: "Office Furniture",
        rating: 4.2,
        totalOrders: 18,
        status: "ACTIVE",
    },
];

const mockPurchaseOrders: PurchaseOrder[] = [
    {
        id: "1",
        poNumber: "PO-2024-001",
        requestId: "REQ-2024-003",
        vendorName: "TechHub Nigeria",
        totalAmount: 450000,
        status: "CONFIRMED",
        createdDate: "2024-01-20",
        deliveryDate: "2024-02-05",
    },
];

const statusColors: Record<ProcurementStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    SOURCED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function ProcurementPage() {
    const router = useRouter();
    const [pendingRequests] = useState<ProcurementRequest[]>(mockPendingRequests);
    const [vendors] = useState<Vendor[]>(mockVendors);
    const [purchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);

    // Columns for Pending Requests
    const requestColumns: ColumnDef<ProcurementRequest>[] = [
        {
            accessorKey: "requestNumber",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Request ID" />,
            cell: ({ row }) => <div className="font-medium">{row.getValue("requestNumber")}</div>,
        },
        {
            accessorKey: "itemName",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Item" />,
            cell: ({ row }) => <div>{row.getValue("itemName")}</div>,
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
            cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
        },
        {
            accessorKey: "department",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
        },
        {
            accessorKey: "status",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const status = row.getValue("status") as ProcurementStatus;
                return (
                    <Badge variant="outline" className={statusColors[status]}>
                        {status.replace("_", " ")}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <Button
                    size="sm"
                    onClick={() => router.push(`/dashboard/procurement/requests/${row.original.id}`)}
                >
                    <Eye className="mr-2" />
                    View
                </Button>
            ),
        },
    ];

    // Columns for Vendors
    const vendorColumns: ColumnDef<Vendor>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Vendor Name" />,
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "category",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
        },
        {
            accessorKey: "contactPerson",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
        },
        {
            accessorKey: "phone",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
        },
        {
            accessorKey: "rating",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <span className="font-medium">{row.getValue("rating")}</span>
                    <span className="text-yellow-500">★</span>
                </div>
            ),
        },
        {
            accessorKey: "totalOrders",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Total Orders" />,
            cell: ({ row }) => <div className="text-center">{row.getValue("totalOrders")}</div>,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/procurement/vendors/${row.original.id}`)}
                >
                    View Details
                </Button>
            ),
        },
    ];

    // Columns for Purchase Orders
    const poColumns: ColumnDef<PurchaseOrder>[] = [
        {
            accessorKey: "poNumber",
            header: ({ column }) => <DataTableColumnHeader column={column} title="PO Number" />,
            cell: ({ row }) => <div className="font-medium">{row.getValue("poNumber")}</div>,
        },
        {
            accessorKey: "requestId",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Request ID" />,
        },
        {
            accessorKey: "vendorName",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Vendor" />,
        },
        {
            accessorKey: "totalAmount",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
            cell: ({ row }) => (
                <div className="font-medium">
                    ₦{(row.getValue("totalAmount") as number).toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return <Badge variant="outline">{status}</Badge>;
            },
        },
        {
            accessorKey: "deliveryDate",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Delivery Date" />,
            cell: ({ row }) => {
                const date = row.getValue("deliveryDate") as string;
                return date ? new Date(date).toLocaleDateString() : "Not set";
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                        <Eye />
                    </Button>
                    <Button size="sm" variant="ghost">
                        <Download />
                    </Button>
                </div>
            ),
        },
    ];

    const requestTable = useDataTableInstance({
        data: pendingRequests,
        columns: requestColumns,
        getRowId: (row) => row.id,
    });

    const vendorTable = useDataTableInstance({
        data: vendors,
        columns: vendorColumns,
        getRowId: (row) => row.id,
    });

    const poTable = useDataTableInstance({
        data: purchaseOrders,
        columns: poColumns,
        getRowId: (row) => row.id,
    });

    return (
        <div className="@container/main flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Procurement Overview</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage sourcing, vendors, and purchase orders
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <Clock className="text-muted-foreground size-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingRequests.filter(r => r.status === "PENDING").length}</div>
                        <p className="text-muted-foreground text-xs mt-1">Awaiting sourcing</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <AlertCircle className="text-blue-500 size-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingRequests.filter(r => r.status === "IN_PROGRESS").length}</div>
                        <p className="text-muted-foreground text-xs mt-1">Being processed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                        <Users className="text-muted-foreground size-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vendors.filter(v => v.status === "ACTIVE").length}</div>
                        <p className="text-muted-foreground text-xs mt-1">Registered suppliers</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active POs</CardTitle>
                        <Package className="text-muted-foreground size-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{purchaseOrders.length}</div>
                        <p className="text-muted-foreground text-xs mt-1">Purchase orders</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-pointer transition-colors hover:bg-accent" onClick={() => router.push("/dashboard/procurement/pending")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="size-5 text-yellow-500" />
                            View Pending Requests
                        </CardTitle>
                        <CardDescription>
                            Process approved requests awaiting procurement
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="cursor-pointer transition-colors hover:bg-accent" onClick={() => router.push("/dashboard/procurement/vendors")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="size-5 text-blue-500" />
                            Manage Vendors
                        </CardTitle>
                        <CardDescription>
                            View and manage your vendor database
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="cursor-pointer transition-colors hover:bg-accent" onClick={() => router.push("/dashboard/procurement/order")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="size-5 text-green-500" />
                            Create Purchase Order
                        </CardTitle>
                        <CardDescription>
                            Generate new PO from approved request
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {/* Tabs for detailed views */}
            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                    <TabsTrigger value="vendors">Vendors</TabsTrigger>
                    <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
                </TabsList>

                {/* Pending Requests Tab */}
                <TabsContent value="pending" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Pending Procurement</CardTitle>
                                    <CardDescription>Requests awaiting sourcing</CardDescription>
                                </div>
                                <Button onClick={() => router.push("/dashboard/procurement/pending")}>
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <DataTable table={requestTable} columns={requestColumns} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Vendors Tab */}
                <TabsContent value="vendors" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Vendor Database</CardTitle>
                                    <CardDescription>Approved suppliers and their details</CardDescription>
                                </div>
                                <Button onClick={() => router.push("/dashboard/procurement/vendor/new")}>
                                    <Plus className="mr-2" />
                                    Add Vendor
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <DataTable table={vendorTable} columns={vendorColumns} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Purchase Orders Tab */}
                <TabsContent value="purchase-orders" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Purchase Orders</CardTitle>
                                    <CardDescription>All generated purchase orders</CardDescription>
                                </div>
                                <Button onClick={() => router.push("/dashboard/procurement/purchase-orders")}>
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border">
                                <DataTable table={poTable} columns={poColumns} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}