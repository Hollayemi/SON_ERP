import {
  Store,
  StockItem,
  Contractor,
  BankAccount,
  StoreVerificationCertificate,
  StoreReceiveVoucher,
  StockReplenishment,
  DepartmentStockRequest,
  CreateStoreInput,
  UpdateStoreInput,
  CreateStockItemInput,
  UpdateStockItemInput,
  CreateContractorInput,
  UpdateContractorInput,
  CreateBankAccountInput,
  UpdateBankAccountInput,
  CreateSVCInput,
  UpdateSVCInput,
  CreateSRVInput,
  CreateStockReplenishmentInput,
  ApproveStockReplenishmentInput,
  CreateDepartmentStockRequestInput,
  ApproveDepartmentRequestInput,
  IssueDepartmentStockInput,
} from "@/types/procurement";
import { BaseResponse } from "../api/types";
import { baseApi } from "../baseApi";

export const procurementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== STORES ====================
    getStores: builder.query<BaseResponse<Store[]>, void>({
      query: () => ({ url: "/stores", method: "GET" }),
      providesTags: [{ type: "Procurement", id: "STORES" }],
    }),

    getStoreById: builder.query<BaseResponse<Store>, number>({
      query: (id) => ({ url: `/stores/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Procurement", id: `STORE_${id}` }],
    }),

    createStore: builder.mutation<BaseResponse<Store>, CreateStoreInput>({
      query: (data) => ({
        url: "/stores",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Procurement", id: "STORES" }],
    }),

    updateStore: builder.mutation<BaseResponse<Store>, UpdateStoreInput>({
      query: ({ id, ...data }) => ({
        url: `/stores/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Procurement", id: "STORES" },
        { type: "Procurement", id: `STORE_${id}` },
      ],
    }),

    // ==================== STOCK ITEMS ====================
    getStockItems: builder.query<BaseResponse<StockItem[]>, { store_id?: number }>({
      query: (params) => ({ url: "/stock-items", method: "GET", params }),
      providesTags: [{ type: "Procurement", id: "STOCK_ITEMS" }],
    }),

    getStockItemById: builder.query<BaseResponse<StockItem>, number>({
      query: (id) => ({ url: `/stock-items/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Procurement", id: `STOCK_ITEM_${id}` }],
    }),

    createStockItem: builder.mutation<BaseResponse<StockItem>, CreateStockItemInput>({
      query: (data) => ({
        url: "/stock-items",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Procurement", id: "STOCK_ITEMS" }],
    }),

    updateStockItem: builder.mutation<BaseResponse<StockItem>, UpdateStockItemInput>({
      query: ({ id, ...data }) => ({
        url: `/stock-items/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Procurement", id: "STOCK_ITEMS" },
        { type: "Procurement", id: `STOCK_ITEM_${id}` },
      ],
    }),

    // ==================== CONTRACTORS ====================
    getContractors: builder.query<BaseResponse<Contractor[]>, void>({
      query: () => ({ url: "/procurement/contractors", method: "GET" }),
      providesTags: [{ type: "Vendors", id: "LIST" }],
    }),

    getContractorById: builder.query<BaseResponse<Contractor>, number>({
      query: (id) => ({ url: `/procurement/contractors/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Vendors", id }],
    }),

    createContractor: builder.mutation<BaseResponse<Contractor>, CreateContractorInput>({
      query: (data) => ({
        url: "/procurement/contractors",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Vendors", id: "LIST" }],
    }),

    updateContractor: builder.mutation<BaseResponse<Contractor>, UpdateContractorInput>({
      query: ({ id, ...data }) => ({
        url: `/procurement/contractors/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Vendors", id: "LIST" },
        { type: "Vendors", id },
      ],
    }),

    // ==================== BANK ACCOUNTS ====================
    getContractorBankAccounts: builder.query<BaseResponse<BankAccount[]>, number>({
      query: (contractorId) => ({
        url: `/procurement/contractors/${contractorId}/bank-accounts`,
        method: "GET",
      }),
      providesTags: (result, error, contractorId) => [
        { type: "Vendors", id: `BANK_ACCOUNTS_${contractorId}` },
      ],
    }),

    createBankAccount: builder.mutation<
      BaseResponse<BankAccount>,
      { contractorId: number; data: CreateBankAccountInput }
    >({
      query: ({ contractorId, data }) => ({
        url: `/procurement/contractors/${contractorId}/bank-accounts`,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { contractorId }) => [
        { type: "Vendors", id: `BANK_ACCOUNTS_${contractorId}` },
        { type: "Vendors", id: contractorId },
      ],
    }),

    updateBankAccount: builder.mutation<BaseResponse<BankAccount>, UpdateBankAccountInput>({
      query: ({ id, ...data }) => ({
        url: `/procurement/bank-accounts/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: "Vendors", id: "LIST" }],
    }),

    // ==================== STORE VERIFICATION CERTIFICATE (SVC) ====================
    getStoreVerifications: builder.query<
      BaseResponse<StoreVerificationCertificate[]>,
      { store_id?: number; status?: string }
    >({
      query: (params) => ({
        url: "/procurement/store-verifications",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Procurement", id: "SVC_LIST" }],
    }),

    createStoreVerification: builder.mutation<BaseResponse<StoreVerificationCertificate>, CreateSVCInput>({
      query: (data) => ({
        url: "/procurement/store-verifications",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Procurement", id: "SVC_LIST" }],
    }),

    updateStoreVerification: builder.mutation<BaseResponse<StoreVerificationCertificate>, UpdateSVCInput>({
      query: ({ id, ...data }) => ({
        url: `/procurement/store-verifications/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: "Procurement", id: "SVC_LIST" }],
    }),

    // ==================== STORE RECEIVE VOUCHER (SRV) ====================
    getStoreReceiveVouchers: builder.query<BaseResponse<StoreReceiveVoucher[]>, { status?: string }>({
      query: (params) => ({
        url: "/procurement/store-receive-vouchers",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Procurement", id: "SRV_LIST" }],
    }),

    createStoreReceiveVoucher: builder.mutation<BaseResponse<StoreReceiveVoucher>, CreateSRVInput>({
      query: (data) => ({
        url: "/procurement/store-receive-vouchers",
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: "Procurement", id: "SRV_LIST" },
        { type: "Procurement", id: "SVC_LIST" },
      ],
    }),

    
    // ==================== STOCK REPLENISHMENT ====================
    getStockReplenishments: builder.query<BaseResponse<StockReplenishment[]>, { status?: string }>({
      query: (params) => ({
        url: "/procurement/stock-replenishments",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Procurement", id: "REPLENISHMENT_LIST" }],
    }),

    createStockReplenishment: builder.mutation<BaseResponse<StockReplenishment>, CreateStockReplenishmentInput>({
      query: (data) => ({
        url: "/procurement/stock-replenishments",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Procurement", id: "REPLENISHMENT_LIST" }],
    }),

    approveStockReplenishment: builder.mutation<BaseResponse<StockReplenishment>, ApproveStockReplenishmentInput>({
      query: ({ id, ...data }) => ({
        url: `/procurement/stock-replenishments/${id}/approve`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: "Procurement", id: "REPLENISHMENT_LIST" }],
    }),

    // ==================== DEPARTMENT STOCK REQUESTS ====================
    getDepartmentStockRequests: builder.query<
      BaseResponse<DepartmentStockRequest[]>,
      { store_id?: number; status?: string }
    >({
      query: (params) => ({
        url: "/procurement/department-stock-requests",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Procurement", id: "DEPT_REQUEST_LIST" }],
    }),

    createDepartmentStockRequest: builder.mutation<
      BaseResponse<DepartmentStockRequest>,
      CreateDepartmentStockRequestInput
    >({
      query: (data) => ({
        url: "/procurement/department-stock-requests",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Procurement", id: "DEPT_REQUEST_LIST" }],
    }),

    approveDepartmentStockRequest: builder.mutation<
      BaseResponse<DepartmentStockRequest>,
      ApproveDepartmentRequestInput
    >({
      query: ({ id, ...data }) => ({
        url: `/procurement/department-stock-requests/${id}/approve`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: "Procurement", id: "DEPT_REQUEST_LIST" }],
    }),

    issueDepartmentStock: builder.mutation<BaseResponse<DepartmentStockRequest>, IssueDepartmentStockInput>({
      query: ({ id, ...data }) => ({
        url: `/procurement/department-stock-requests/${id}/issue`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [
        { type: "Procurement", id: "DEPT_REQUEST_LIST" },
        { type: "Procurement", id: "STOCK_ITEMS" },
      ],
    }),
  }),
});

// ==================== EXPORTS ====================
export const {
  // Stores
  useGetStoresQuery,
  useGetStoreByIdQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,

  // Stock Items
  useGetStockItemsQuery,
  useGetStockItemByIdQuery,
  useCreateStockItemMutation,
  useUpdateStockItemMutation,

  // Contractors
  useGetContractorsQuery,
  useGetContractorByIdQuery,
  useCreateContractorMutation,
  useUpdateContractorMutation,

  // Bank Accounts
  useGetContractorBankAccountsQuery,
  useCreateBankAccountMutation,
  useUpdateBankAccountMutation,

  // Store Verification Certificate
  useGetStoreVerificationsQuery,
  useCreateStoreVerificationMutation,
  useUpdateStoreVerificationMutation,

  // Store Receive Voucher
  useGetStoreReceiveVouchersQuery,
  useCreateStoreReceiveVoucherMutation,

  // Stock Replenishment
  useGetStockReplenishmentsQuery,
  useCreateStockReplenishmentMutation,
  useApproveStockReplenishmentMutation,

  // Department Stock Requests
  useGetDepartmentStockRequestsQuery,
  useCreateDepartmentStockRequestMutation,
  useApproveDepartmentStockRequestMutation,
  useIssueDepartmentStockMutation,
} = procurementApi;