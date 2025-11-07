"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2, Eye, Star, Users, Package } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

// Mock Data
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
  {
    id: "3",
    name: "Prime Suppliers",
    contactPerson: "James Ibrahim",
    email: "contact@primesuppliers.ng",
    phone: "+234 803 456 7890",
    category: "General",
    rating: 3.8,
    totalOrders: 12,
    status: "ACTIVE",
  },
  {
    id: "4",
    name: "Tech Solutions Inc",
    contactPerson: "Sarah Ahmed",
    email: "info@techsolutions.ng",
    phone: "+234 804 567 8901",
    category: "IT Equipment",
    rating: 4.7,
    totalOrders: 30,
    status: "ACTIVE",
  },
  {
    id: "5",
    name: "Furniture World",
    contactPerson: "David Eze",
    email: "sales@furnitureworld.ng",
    phone: "+234 805 678 9012",
    category: "Office Furniture",
    rating: 4.0,
    totalOrders: 15,
    status: "INACTIVE",
  },
];

const categories = ["All Categories", "IT Equipment", "Office Furniture", "General"];

export default function VendorsPage() {
  const router = useRouter();
  const [data] = useState<Vendor[]>(mockVendors);
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((vendor) => {
    const matchesCategory = categoryFilter === "All Categories" || vendor.category === categoryFilter;
    const matchesSearch =
      searchQuery === "" ||
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Vendor Name" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {row.getValue("category")}
        </Badge>
      ),
    },
    {
      accessorKey: "contactPerson",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Contact Person" />,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Star className="size-4 fill-yellow-500 text-yellow-500" />
          <span className="font-medium">{row.getValue("rating")}</span>
        </div>
      ),
    },
    {
      accessorKey: "totalOrders",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Orders" />,
      cell: ({ row }) => <div className="text-center">{row.getValue("totalOrders")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant="outline"
            className={
              status === "ACTIVE"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Eye className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/procurement/vendors/${row.original.id}`)}>
              <Eye className="mr-2 size-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/procurement/vendors/${row.original.id}/edit`)}>
              <Edit className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="@container/main flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vendor Database</h1>
          <p className="text-muted-foreground text-sm">Manage your approved suppliers and their information</p>
        </div>
        <Button onClick={() => router.push("/dashboard/procurement/vendor/new")}>
          <Plus className="mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Users className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.filter((v) => v.status === "ACTIVE").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.reduce((sum, v) => sum + v.totalOrders, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data.reduce((sum, v) => sum + v.rating, 0) / data.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Approved Vendors</CardTitle>
          <CardDescription>Complete list of registered and approved suppliers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search vendors by name, contact person, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <DataTable table={table} columns={columns} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
