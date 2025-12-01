import {
  Store,
  StockItem,
  Contractor,
  BankAccount,
  CreateStoreInput,
  UpdateStoreInput,
  CreateStockItemInput,
  CreateContractorInput,
  UpdateContractorInput,
  CreateBankAccountInput,
  UpdateBankAccountInput,
  UpdateStockItemInput,
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
      providesTags: [{ type: "Procurement", id: "LIST" }],
    }),

    getContractorById: builder.query<BaseResponse<Contractor>, number>({
      query: (id) => ({ url: `/procurement/contractors/${id}`, method: "GET" }),
      providesTags: [{ type: "Procurement" }],
    }),

    createContractor: builder.mutation<BaseResponse<Contractor>, CreateContractorInput>({
      query: (data) => ({
        url: "/procurement/contractors",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Procurement", id: "LIST" }],
    }),

    updateContractor: builder.mutation<BaseResponse<Contractor>, UpdateContractorInput>({
      query: ({ id, ...data }) => ({
        url: `/procurement/contractors/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [{ type: "Procurement", id: "LIST" }, { type: "Procurement" }],
    }),

    // ==================== BANK ACCOUNTS ====================
    getContractorBankAccounts: builder.query<BaseResponse<BankAccount[]>, number>({
      query: (contractorId) => ({
        url: `/procurement/contractors/${contractorId}/bank-accounts`,
        method: "GET",
      }),
      providesTags: (result, error, contractorId) => [{ type: "Procurement" }],
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
      invalidatesTags: (result, error, { contractorId }) => [{ type: "Procurement" }, { type: "Contractors" }],
    }),

    updateBankAccount: builder.mutation<BaseResponse<BankAccount>, UpdateBankAccountInput>({
      query: ({ id, ...data }) => ({
        url: `/procurement/bank-accounts/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Contractors", id: "LIST" }],
    }),
  }),
});

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
} = procurementApi;
