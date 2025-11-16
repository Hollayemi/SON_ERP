import { get } from "http";
import { BaseResponse } from "../api/types";
import { baseApi } from "../baseApi";
import type { User, UserRole } from "../types";
import { CreateUserInput, UpdateUserInput } from "./types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], { role?: UserRole; department?: string; isActive?: boolean }>({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: [{ type: "Users", id: "LIST" }],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    createUser: builder.mutation<BaseResponse<User>, FormData>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUser: builder.mutation<User, UpdateUserInput>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    toggleUserStatus: builder.mutation<User, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    updateUserRole: builder.mutation<User, { id: string; role: UserRole }>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    // roles

    getRoles: builder.query<BaseResponse, void>({
      query: () => ({
        url: "/authorization/roles",
      }),
      providesTags: [{ type: "Authorization", id: "LIST" }],
    }),
    getPermissions: builder.query<BaseResponse, void>({
      query: () => ({
        url: "/authorization/permissions",
      }),
      providesTags: [{ type: "Authorization", id: "LIST" }],
    }),
  }),


});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
  useUpdateUserRoleMutation,

  useGetRolesQuery,
  useGetPermissionsQuery
} = usersApi;
