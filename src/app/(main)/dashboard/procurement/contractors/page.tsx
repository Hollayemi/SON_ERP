"use client";

import React, { useMemo, useState } from "react";
import { Plus, Eye, Edit, Users, Building2, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  useGetContractorsQuery,
  useCreateContractorMutation,
  useUpdateContractorMutation,
  useGetContractorBankAccountsQuery,
  useCreateBankAccountMutation,
  useUpdateBankAccountMutation,
} from "@/stores/services/procurementApi";

export default function ContractorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<any | null>(null);

  const { data, isLoading } = useGetContractorsQuery();
  const contractors = data?.data || [];

  const filteredData = useMemo(
    () =>
      contractors.filter((contractor) => {
        const matchesSearch =
          searchQuery === "" ||
          contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contractor.company_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || contractor.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [contractors, searchQuery, statusFilter],
  );

  const stats = useMemo(() => {
    return {
      total: contractors.length,
      active: contractors.filter((c) => c.status === "Active").length,
      companies: contractors.filter((c) => c.contractor_type === "company").length,
      individuals: contractors.filter((c) => c.contractor_type === "individual").length,
    };
  }, [contractors]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="tracking-tight_ text-2xl font-semibold">Contractors Management</h1>
          <p className="text-muted-foreground text-sm">Manage contractor database and bank details</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Add Contractor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Contractor</DialogTitle>
              <DialogDescription>Register a new contractor in the system</DialogDescription>
            </DialogHeader>
            <CreateContractorForm onSuccess={() => setCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Contractors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.companies}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Individuals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.individuals}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search contractors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contractors Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((contractor) => (
          <Card key={contractor.id} className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="text-primary size-5" />
                  <div>
                    <CardTitle className="text-base">{contractor.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{contractor.company_name}</p>
                  </div>
                </div>
                <Badge variant={contractor.status === "Active" ? "default" : "secondary"}>{contractor.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Code</p>
                <p className="font-mono text-sm font-medium">{contractor.code}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Contact</p>
                <p className="text-sm">{contractor.email}</p>
                <p className="font-mono text-sm">{contractor.phone}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedContractor(contractor);
                    setViewDialogOpen(true);
                  }}
                >
                  <Eye className="mr-1 size-4" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedContractor(contractor);
                    setEditDialogOpen(true);
                  }}
                >
                  <Edit className="mr-1 size-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      {selectedContractor && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contractor Details</DialogTitle>
            </DialogHeader>
            <ViewContractorDetails contractor={selectedContractor} />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
      {selectedContractor && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Contractor</DialogTitle>
            </DialogHeader>
            <EditContractorForm contractor={selectedContractor} onSuccess={() => setEditDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function CreateContractorForm({ onSuccess }: any) {
  const [createContractor, { isLoading }] = useCreateContractorMutation();
  type ContractorType = "company" | "individual";
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    company_name: string;
    contractor_type: ContractorType;
    email: string;
    phone: string;
    address: string;
    tax_id: string;
    contact_person: string;
    registration_number: string;
    license_number: string;
    license_expiry_date: string;
  }>({
    name: "",
    code: "",
    company_name: "",
    contractor_type: "company",
    email: "",
    phone: "",
    address: "",
    tax_id: "",
    contact_person: "",
    registration_number: "",
    license_number: "",
    license_expiry_date: "",
  });

  const handleSubmit = async () => {
    try {
      await createContractor(formData).unwrap();
      toast.success("Contractor created successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to create contractor");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Code *</Label>
          <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Company Name *</Label>
          <Input
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Type *</Label>
          <Select
            value={formData.contractor_type}
            onValueChange={(v) => setFormData({ ...formData, contractor_type: v as ContractorType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Phone *</Label>
          <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Address *</Label>
        <Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Tax ID</Label>
          <Input value={formData.tax_id} onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Contact Person</Label>
          <Input
            value={formData.contact_person}
            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
          />
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Contractor"}
      </Button>
    </div>
  );
}

function EditContractorForm({ contractor, onSuccess }: any) {
  const [updateContractor, { isLoading }] = useUpdateContractorMutation();
  const [formData, setFormData] = useState({
    name: contractor.name,
    code: contractor.code,
    company_name: contractor.company_name,
    contractor_type: contractor.contractor_type,
    email: contractor.email,
    phone: contractor.phone,
    address: contractor.address,
  });

  const handleSubmit = async () => {
    try {
      await updateContractor({ id: contractor.id, ...formData }).unwrap();
      toast.success("Contractor updated successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to update contractor");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Code *</Label>
          <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Phone *</Label>
          <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Contractor"}
      </Button>
    </div>
  );
}

function ViewContractorDetails({ contractor }: any) {
  const { data: bankAccountsData } = useGetContractorBankAccountsQuery(contractor.id);
  const bankAccounts = bankAccountsData?.data || [];

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="bank">Bank Accounts ({bankAccounts.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="space-y-4 pt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-muted-foreground">Name</Label>
            <p className="font-medium">{contractor.name}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Code</Label>
            <p className="font-mono">{contractor.code}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="text-muted-foreground">Email</Label>
            <p>{contractor.email}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Phone</Label>
            <p className="font-mono">{contractor.phone}</p>
          </div>
        </div>
        <div>
          <Label className="text-muted-foreground">Address</Label>
          <p>{contractor.address}</p>
        </div>
      </TabsContent>
      <TabsContent value="bank" className="space-y-4 pt-4">
        {bankAccounts.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">No bank accounts added</p>
        ) : (
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="text-primary size-4" />
                        <p className="font-medium">{account.bank_name}</p>
                        {account.is_primary && <Badge variant="default">Primary</Badge>}
                      </div>
                      <p className="font-mono text-sm">{account.account_number}</p>
                      <p className="text-muted-foreground text-sm">{account.account_name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
