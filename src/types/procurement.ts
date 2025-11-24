import { BaseResponse } from "../stores/api/types";
import { baseApi } from "../stores/baseApi";

// ==================== TYPES ====================

export interface Store {
  id: number;
  name: string;
  code: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  state_office_id: number;
  store_head_id: number;
  state_office?: StateOffice;
  store_head?: User;
  stock_items?: StockItem[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface StateOffice {
  id: number;
  name: string;
  code: string;
  description: string;
  state_id: number;
  zone_id: number | null;
  status: string;
  office_manager_id: number | null;
  address: string;
  phone: string;
  email: string;
  website: string | null;
  state: State;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface State {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  email_verified_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StockItem {
  id: number;
  store_id: number;
  name: string;
  code: string;
  description: string | null;
  category: string | null;
  unit_of_measure: string;
  min_stock_level: string;
  max_stock_level: string | null;
  status: string;
  quantity: string;
  location: string | null;
  last_restocked_at: string | null;
  store?: Store;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Contractor {
  id: number;
  name: string;
  code: string;
  company_name: string;
  contractor_type: "individual" | "company";
  email: string;
  phone: string;
  address: string;
  tax_id: string | null;
  contact_person: string | null;
  registration_number: string | null;
  license_number: string | null;
  license_expiry_date: string | null;
  status: string;
  bank_accounts?: BankAccount[];
  primary_bank_account?: BankAccount;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface BankAccount {
  id: number;
  accountable_type: string;
  accountable_id: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  account_type: "savings" | "current";
  branch_name: string | null;
  branch_code: string | null;
  swift_code: string | null;
  iban: string | null;
  currency: string;
  is_primary: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface StoreVerificationCertificate {
  id: number;
  store_id: number;
  contractor_id: number;
  verification_number: string;
  goods_description: string;
  quantity_received: string;
  verified_by: number;
  verification_date: string;
  status: "pending" | "verified" | "rejected";
  remarks: string | null;
  store?: Store;
  contractor?: Contractor;
  verified_by_user?: User;
  created_at: string;
  updated_at: string;
}

export interface StoreReceiveVoucher {
  id: number;
  svc_id: number;
  srv_number: string;
  received_by: number;
  receive_date: string;
  status: "pending" | "completed";
  remarks: string | null;
  svc?: StoreVerificationCertificate;
  received_by_user?: User;
  created_at: string;
  updated_at: string;
}

export interface ProcurementDocument {
  id: number;
  srv_id: number;
  document_type: "award_letter" | "invoice" | "purchase_order" | "payment_request" | "other";
  document_number: string;
  document_url: string;
  uploaded_by: number;
  status: "pending" | "approved" | "rejected";
  srv?: StoreReceiveVoucher;
  uploaded_by_user?: User;
  created_at: string;
  updated_at: string;
}

export interface DGApproval {
  id: number;
  srv_id: number;
  approved_by: number;
  approval_date: string;
  status: "pending" | "approved" | "rejected";
  comments: string | null;
  srv?: StoreReceiveVoucher;
  approved_by_user?: User;
  created_at: string;
  updated_at: string;
}

export interface StockReplenishment {
  id: number;
  store_id: number;
  initiated_by: number;
  item_name: string;
  quantity_requested: string;
  justification: string;
  director_gsd_approval: "pending" | "approved" | "rejected";
  dg_approval: "pending" | "approved" | "rejected";
  status: "pending" | "approved" | "in_procurement" | "completed";
  store?: Store;
  initiated_by_user?: User;
  created_at: string;
  updated_at: string;
}

export interface DepartmentStockRequest {
  id: number;
  requesting_department: string;
  requested_by: number;
  store_id: number;
  stock_item_id: number;
  quantity_requested: string;
  purpose: string;
  store_head_status: "pending" | "approved" | "rejected";
  director_gsd_status: "pending" | "approved" | "rejected";
  issuance_status: "pending" | "issued";
  issued_by: number | null;
  issued_date: string | null;
  store?: Store;
  stock_item?: StockItem;
  requested_by_user?: User;
  issued_by_user?: User;
  created_at: string;
  updated_at: string;
}

// ==================== INPUT TYPES ====================

export interface CreateStoreInput {
  name: string;
  code: string;
  store_head_id: number;
  state_office_id: number;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface UpdateStoreInput extends Partial<CreateStoreInput> {
  id: number;
}

export interface CreateStockItemInput {
  store_id: number;
  name: string;
  code: string;
  quantity: number;
  description?: string;
  category?: string;
  unit_of_measure?: string;
  min_stock_level?: number;
  max_stock_level?: number;
  location?: string;
}

export interface UpdateStockItemInput extends Partial<CreateStockItemInput> {
  id: number;
}

export interface CreateContractorInput {
  name: string;
  code: string;
  company_name: string;
  contractor_type: "individual" | "company";
  email: string;
  phone: string;
  address: string;
  tax_id?: string;
  contact_person?: string;
  registration_number?: string;
  license_number?: string;
  license_expiry_date?: string;
}

export interface UpdateContractorInput extends Partial<CreateContractorInput> {
  id: number;
}

export interface CreateBankAccountInput {
  bank_name: string;
  account_number: string;
  account_name: string;
  account_type: "savings" | "current";
  is_primary?: boolean;
  branch_name?: string;
  branch_code?: string;
  swift_code?: string;
  iban?: string;
  currency?: string;
}

export interface UpdateBankAccountInput extends Partial<CreateBankAccountInput> {
  id: number;
}

export interface CreateSVCInput {
  store_id: number;
  contractor_id: number;
  goods_description: string;
  quantity_received: string;
  verification_date: string;
  remarks?: string;
}

export interface UpdateSVCInput {
  id: number;
  status: "pending" | "verified" | "rejected";
  remarks?: string;
}

export interface CreateSRVInput {
  svc_id: number;
  receive_date: string;
  remarks?: string;
}

export interface CreateStockReplenishmentInput {
  store_id: number;
  item_name: string;
  quantity_requested: string;
  justification: string;
}

export interface ApproveStockReplenishmentInput {
  id: number;
  approval_type: "director_gsd" | "dg";
  status: "approved" | "rejected";
  comments?: string;
}

export interface CreateDepartmentStockRequestInput {
  requesting_department: string;
  store_id: number;
  stock_item_id: number;
  quantity_requested: string;
  purpose: string;
}

export interface ApproveDepartmentRequestInput {
  id: number;
  approval_type: "store_head" | "director_gsd";
  status: "approved" | "rejected";
  comments?: string;
}

export interface IssueDepartmentStockInput {
  id: number;
  issued_date: string;
}
