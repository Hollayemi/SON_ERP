"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Plus, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const POItemSchema = z.object({
    itemName: z.string().min(1, "Item name is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.coerce.number().min(0, "Unit price must be positive"),
});

const FormSchema = z.object({
    requestId: z.string().min(1, "Please select a request"),
    vendorId: z.string().min(1, "Please select a vendor"),
    items: z.array(POItemSchema).min(1, "At least one item is required"),
    deliveryDate: z.string().optional(),
    terms: z.string().optional(),
    notes: z.string().optional(),
});

// Mock data
const mockRequests = [
    { id: "REQ-2024-001", itemName: "Desktop Computers", quantity: 3, department: "IT" },
    { id: "REQ-2024-002", itemName: "Office Chairs", quantity: 10, department: "Admin" },
];

const mockVendors = [
    { id: "1", name: "TechHub Nigeria", category: "IT Equipment" },
    { id: "2", name: "Office Essentials Ltd", category: "Office Furniture" },
    { id: "3", name: "Prime Suppliers", category: "General" },
];

export default function CreatePurchaseOrderPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            requestId: "",
            vendorId: "",
            items: [{ itemName: "", quantity: 1, unitPrice: 0 }],
            deliveryDate: "",
            terms: "",
            notes: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const calculateTotal = () => {
        const items = form.watch("items");
        return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const poNumber = `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

            toast.success(`Purchase Order ${poNumber} created successfully!`, {
                description: "The PO has been sent to the vendor and Finance/Admin.",
            });

            router.push("/dashboard/procurement/purchase-orders");
        } catch (error) {
            toast.error("Failed to create purchase order");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestChange = (requestId: string) => {
        const request = mockRequests.find(r => r.id === requestId);
        if (request) {
            setSelectedRequest(request);
            // Pre-fill item details from request
            form.setValue("items", [{
                itemName: request.itemName,
                quantity: request.quantity,
                unitPrice: 0,
            }]);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create Purchase Order</h1>
                    <p className="text-muted-foreground text-sm">
                        Generate a new purchase order from approved request
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Form - 2 columns */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Request & Vendor Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Details</CardTitle>
                                    <CardDescription>Select the request and vendor for this purchase order</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="requestId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Request *</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        handleRequestChange(value);
                                                    }}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a request" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mockRequests.map((request) => (
                                                            <SelectItem key={request.id} value={request.id}>
                                                                {request.id} - {request.itemName} ({request.department})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {selectedRequest && (
                                        <div className="bg-muted rounded-lg p-4">
                                            <h4 className="font-medium mb-2">Request Details</h4>
                                            <div className="text-sm space-y-1">
                                                <p><span className="text-muted-foreground">Item:</span> {selectedRequest.itemName}</p>
                                                <p><span className="text-muted-foreground">Quantity:</span> {selectedRequest.quantity}</p>
                                                <p><span className="text-muted-foreground">Department:</span> {selectedRequest.department}</p>
                                            </div>
                                        </div>
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="vendorId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Vendor *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a vendor" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mockVendors.map((vendor) => (
                                                            <SelectItem key={vendor.id} value={vendor.id}>
                                                                {vendor.name} - {vendor.category}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="deliveryDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Expected Delivery Date</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type="date" {...field} />
                                                        <Calendar className="absolute right-3 top-3 size-4 text-muted-foreground pointer-events-none" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Items */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Order Items</CardTitle>
                                            <CardDescription>Add items and quantities for this purchase order</CardDescription>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => append({ itemName: "", quantity: 1, unitPrice: 0 })}
                                        >
                                            <Plus className="mr-2" />
                                            Add Item
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="border rounded-lg p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium">Item {index + 1}</h4>
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <Trash2 className="size-4 text-destructive" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-3">
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.itemName`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Item Name *</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="e.g., Dell Laptop" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.quantity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Quantity *</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" min="1" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.unitPrice`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Unit Price (₦) *</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" min="0" step="0.01" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="bg-muted rounded p-2 text-sm">
                                                <span className="text-muted-foreground">Subtotal: </span>
                                                <span className="font-medium">
                                                    ₦{(form.watch(`items.${index}.quantity`) * form.watch(`items.${index}.unitPrice`)).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Additional Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Additional Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="terms"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Payment Terms</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="e.g., Net 30 days, 50% upfront..."
                                                        className="min-h-20 resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Any additional notes or instructions..."
                                                        className="min-h-20 resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Summary Sidebar - 1 column */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-6">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Items</span>
                                            <span className="font-medium">{fields.length}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Total Quantity</span>
                                            <span className="font-medium">
                                                {form.watch("items").reduce((sum, item) => sum + (item.quantity || 0), 0)}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span className="font-medium">Total Amount</span>
                                            <span className="text-xl font-bold">
                                                ₦{calculateTotal().toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? "Creating PO..." : "Create Purchase Order"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => router.back()}
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </Button>
                                    </div>

                                    <div className="text-xs text-muted-foreground space-y-1 pt-4">
                                        <p>• PO will be sent to selected vendor</p>
                                        <p>• Finance/Admin will be notified</p>
                                        <p>• Request status will be updated</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}