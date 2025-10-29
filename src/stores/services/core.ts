import { BaseResponse } from "../api/types";
import { baseApi } from "../baseApi";

export const coreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<BaseResponse, void>({
      query: () => ({ url: "/departments", method: "GET" }),
      providesTags: [{ type: "Departments" }],
    }),
  }),
});

export const { useGetDepartmentsQuery } = coreApi;
