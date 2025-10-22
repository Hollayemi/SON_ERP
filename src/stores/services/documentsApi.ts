import { baseApi } from "../baseApi";
import type { Document } from "../types";
import { UploadDocumentInput } from "./types";

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<Document[], { requestId?: string; category?: string }>({
      query: (params) => ({
        url: "/documents",
        params,
      }),
      providesTags: [{ type: "Documents", id: "LIST" }],
    }),

    uploadDocument: builder.mutation<Document, UploadDocumentInput>({
      query: ({ file, requestId, category }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("requestId", requestId);
        formData.append("category", category);

        return {
          url: "/documents/upload",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: [{ type: "Documents", id: "LIST" }, { type: "Requests" }],
    }),

    deleteDocument: builder.mutation<void, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Documents", id: "LIST" }],
    }),

    downloadDocument: builder.query<Blob, string>({
      query: (id) => ({
        url: `/documents/${id}/download`,
        responseHandler: (response: any) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useLazyDownloadDocumentQuery,
} = documentsApi;
