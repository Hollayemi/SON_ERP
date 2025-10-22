import { baseApi } from "../baseApi";
import type { Request, Comment } from "../types";
import { CreateRequestInput, GetRequestsParams, PaginatedResponse, UpdateRequestInput } from "./types";

export const requestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequests: builder.query<PaginatedResponse<Request>, GetRequestsParams>({
      query: (params) => ({
        url: "/requests",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "Requests" as const, id })), { type: "Requests", id: "LIST" }]
          : [{ type: "Requests", id: "LIST" }],
    }),

    getMyRequests: builder.query<PaginatedResponse<Request>, GetRequestsParams>({
      query: (params) => ({
        url: "/requests/my-requests",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Requests", id: "MY_LIST" }],
    }),

    getRequestById: builder.query<Request, string>({
      query: (id) => ({ url: `/requests/${id}` }),
      providesTags: (result, error, id) => [{ type: "Requests", id }],
    }),

    createRequest: builder.mutation<Request, CreateRequestInput>({
      query: (body) => ({
        url: "/requests",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Requests", id: "LIST" }, { type: "Requests", id: "MY_LIST" }, "Dashboard"],
    }),

    updateRequest: builder.mutation<Request, UpdateRequestInput>({
      query: ({ id, ...body }) => ({
        url: `/requests/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Requests", id },
        { type: "Requests", id: "LIST" },
        "Dashboard",
      ],
    }),

    deleteRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Requests", id: "LIST" }, "Dashboard"],
    }),

    addComment: builder.mutation<Comment, { requestId: string; content: string }>({
      query: ({ requestId, content }) => ({
        url: `/requests/${requestId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { requestId }) => [{ type: "Requests", id: requestId }],
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useGetMyRequestsQuery,
  useGetRequestByIdQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
  useAddCommentMutation,
} = requestsApi;
