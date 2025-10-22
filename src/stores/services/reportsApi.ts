import { baseApi } from "../baseApi";
import { ReportData, ReportParams } from "./types";

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportData: builder.query<ReportData, ReportParams>({
      query: (params) => ({
        url: "/reports",
        params,
      }),
      providesTags: [{ type: "Reports", id: "DATA" }],
    }),

    exportReport: builder.query<Blob, ReportParams & { format: "excel" | "pdf" }>({
      query: (params) => ({
        url: "/reports/export",
        params,
        responseHandler: (response: any) => response.blob(),
      }),
    }),

    getApprovalTimeline: builder.query<any, { requestId: string }>({
      query: ({ requestId }) => ({ url: `/reports/approval-timeline/${requestId}` }),
    }),
  }),
});

export const { useGetReportDataQuery, useLazyExportReportQuery, useGetApprovalTimelineQuery } = reportsApi;
