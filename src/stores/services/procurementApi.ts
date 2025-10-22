import { baseApi } from "../baseApi";
import type { Request, PurchaseOrder, Vendor } from "../types";
import { CreatePOInput } from "./types";

export const procurementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingProcurementRequests: builder.query<Request[], void>({
      query: () => ({ url: "/procurement/pending" }),
      providesTags: [{ type: "Procurement", id: "PENDING" }],
    }),

    getVendors: builder.query<Vendor[], { category?: string }>({
      query: (params) => ({
        url: "/procurement/vendors",
        params,
      }),
      providesTags: [{ type: "Vendors", id: "LIST" }],
    }),

    createVendor: builder.mutation<Vendor, Omit<Vendor, "id" | "createdAt">>({
      query: (body) => ({
        url: "/procurement/vendors",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vendors", id: "LIST" }],
    }),

    getPurchaseOrders: builder.query<PurchaseOrder[], { status?: string }>({
      query: (params) => ({
        url: "/procurement/purchase-orders",
        params,
      }),
      providesTags: [{ type: "PurchaseOrders", id: "LIST" }],
    }),

    createPurchaseOrder: builder.mutation<PurchaseOrder, CreatePOInput>({
      query: (body) => ({
        url: "/procurement/purchase-orders",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "PurchaseOrders", id: "LIST" },
        { type: "Procurement", id: "PENDING" },
        { type: "Finance", id: "PENDING" },
        "Dashboard",
      ],
    }),

    updatePOStatus: builder.mutation<PurchaseOrder, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/procurement/purchase-orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [{ type: "PurchaseOrders", id: "LIST" }, "Dashboard"],
    }),
  }),
});

export const {
  useGetPendingProcurementRequestsQuery,
  useGetVendorsQuery,
  useCreateVendorMutation,
  useGetPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePOStatusMutation,
} = procurementApi;
