import { baseApi } from "../baseApi";
import type { Request } from "../types";
import { ApprovalAction } from "./types";

export const approvalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingCheckerRequests: builder.query<Request[], void>({
      query: () => ({ url: "/approvals/checker/pending", method: "GET" }),
      providesTags: [{ type: "Approvals", id: "CHECKER" }],
    }),

    getPendingReviewerRequests: builder.query<Request[], void>({
      query: () => ({ url: "/approvals/reviewer/pending", method: "GET" }),
      providesTags: [{ type: "Approvals", id: "REVIEWER" }],
    }),

    getPendingApproverRequests: builder.query<Request[], void>({
      query: () => ({ url: "/approvals/approver/pending", method: "GET" }),
      providesTags: [{ type: "Approvals", id: "APPROVER" }],
    }),

    checkerApproval: builder.mutation<Request, ApprovalAction>({
      query: (body) => ({
        url: "/approvals/checker",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Approvals", id: "CHECKER" }, { type: "Requests", id: "LIST" }, "Dashboard"],
    }),

    reviewerApproval: builder.mutation<Request, ApprovalAction>({
      query: (body) => ({
        url: "/approvals/reviewer",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Approvals", id: "REVIEWER" }, { type: "Requests", id: "LIST" }, "Dashboard"],
    }),

    approverApproval: builder.mutation<Request, ApprovalAction>({
      query: (body) => ({
        url: "/approvals/approver",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Approvals", id: "APPROVER" },
        { type: "Requests", id: "LIST" },
        { type: "Procurement", id: "PENDING" },
        "Dashboard",
      ],
    }),
  }),
});

export const {
  useGetPendingCheckerRequestsQuery,
  useGetPendingReviewerRequestsQuery,
  useGetPendingApproverRequestsQuery,
  useCheckerApprovalMutation,
  useReviewerApprovalMutation,
  useApproverApprovalMutation,
} = approvalApi;
