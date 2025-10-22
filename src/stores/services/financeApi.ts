import { baseApi } from "../baseApi";
import type { Payment, Request } from "../types";
import { BudgetData, ProcessPaymentInput } from "./types";

export const financeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingPayments: builder.query<Request[], void>({
      query: () => ({ url: "/finance/pending-payments" }),
      providesTags: [{ type: "Finance", id: "PENDING" }],
    }),

    getPaymentHistory: builder.query<Payment[], { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: "/finance/payments",
        params,
      }),
      providesTags: [{ type: "Finance", id: "HISTORY" }],
    }),

    processPayment: builder.mutation<Payment, ProcessPaymentInput>({
      query: (body) => ({
        url: "/finance/process-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Finance", id: "PENDING" },
        { type: "Finance", id: "HISTORY" },
        { type: "Requests", id: "LIST" },
        "Dashboard",
      ],
    }),

    getBudgetTracker: builder.query<BudgetData, { year?: number }>({
      query: (params) => ({
        url: "/finance/budget",
        params,
      }),
      providesTags: [{ type: "Finance", id: "BUDGET" }],
    }),

    exportExpenditures: builder.query<Blob, { format: "excel" | "pdf"; startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: "/finance/export",
        params,
        responseHandler: (response: any) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetPendingPaymentsQuery,
  useGetPaymentHistoryQuery,
  useProcessPaymentMutation,
  useGetBudgetTrackerQuery,
  useLazyExportExpendituresQuery,
} = financeApi;
