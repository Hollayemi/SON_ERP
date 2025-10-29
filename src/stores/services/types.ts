import { BaseResponse } from "../api/types";
import { User, UserRole } from "../types";

export interface ApprovalAction {
  requestId: string;
  action: "APPROVE" | "REJECT" | "RETURN";
  comments?: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}

export type LoginResponse = BaseResponse<{
  user: User;
  token: string;
}>;

export type ForgotPasswordResponse = BaseResponse;

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UploadDocumentInput {
  requestId: string;
  file: File;
  category: "JUSTIFICATION" | "INVOICE" | "RECEIPT" | "PO" | "OTHER";
}

export interface CreateUserInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  department_id: string;
  employee_id: string;
  image: any;
  user_access: string;
  phone?: string;
}

export interface UpdateUserInput extends Partial<Omit<CreateUserInput, "password">> {
  id: string;
}

export interface ProcessPaymentInput {
  requestId: string;
  purchaseOrderId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
}

export interface BudgetData {
  totalBudget: number;
  spent: number;
  available: number;
  categoryBreakdown: Array<{
    category: string;
    allocated: number;
    spent: number;
  }>;
}

export interface CreatePOInput {
  requestId: string;
  vendorId: string;
  items: Array<{
    itemName: string;
    quantity: number;
    unitPrice: number;
  }>;
  deliveryDate?: string;
}

export interface ReportParams {
  startDate?: string;
  endDate?: string;
  department?: string;
  status?: string;
}

export interface ReportData {
  summary: {
    totalRequests: number;
    totalExpenditure: number;
    averageProcessingTime: number;
  };
  departmentBreakdown: Array<{
    department: string;
    requests: number;
    expenditure: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    requests: number;
    expenditure: number;
  }>;
}

export interface CreateRequestInput {
  itemName: string;
  quantity: number;
  department: string;
  purpose: string;
  justification?: string;
}

export interface UpdateRequestInput extends Partial<CreateRequestInput> {
  id: string;
}

export interface GetRequestsParams {
  status?: string;
  department?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
