"use client";

import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { getAccessToken, refreshToken, setAccessToken, clearAuthData, server } from "./auth";
import { toast } from "sonner";

export type RequestConfig = {
  url: string;
  method?: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  skipSuccessToast?: boolean;
};

type BaseError = { status: number; data?: any; message?: string };

// this build url params
const buildUrl = (urlPath: string, params?: Record<string, any>) => {
  const url = new URL(`${server}/api/v1${urlPath}`);
  if (params)
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    });
  return url.toString();
};

export const fetchBaseQueryWithReauth: BaseQueryFn<RequestConfig, unknown, BaseError> = async (args) => {
  const { url, method = "GET", data, params, headers = {}, skipSuccessToast = false } = args;

  const makeRequest = async (token?: string) => {
    const fullUrl = buildUrl(url, params);
    const mergedHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const options: RequestInit = {
      method,
      headers: mergedHeaders,
      credentials: "include", // include cookies for refresh endpoint
    };

    if (method !== "GET" && method !== "HEAD" && data !== undefined) {
      options.body = JSON.stringify(data);
    }

    const res = await fetch(fullUrl, options);
    const contentType = res.headers.get("content-type");
    const responseData = contentType?.includes("application/json") ? await res.json() : await res.text();

    return { res, responseData };
  };

  try {
    let token = getAccessToken() || undefined;
    // first attempt
    const attempt = await makeRequest(token);
    if (attempt.res.ok) {
      if (!skipSuccessToast) {
        const body = attempt.responseData as any;
        if (body?.type === "success" && body?.message && body.message !== "success") {
          toast.success(body.message);
        }
      }
      return { data: attempt.responseData };
    }

    if (attempt.res.status === 401) {
      try {
        const newToken = await refreshToken();
        token = newToken;
        const retry = await makeRequest(token);
        if (retry.res.ok) {
          if (!skipSuccessToast) {
            const body = retry.responseData as any;
            if (body?.type === "success" && body?.message && body.message !== "success") {
              toast.success(body.message);
            }
          }
          return { data: retry.responseData };
        } else {
          // retry failed — clear auth
          clearAuthData();
          toast.error("Session expired. Please login again.");
          return {
            error: {
              status: retry.res.status,
              data: retry.responseData,
              message: retry.res.statusText,
            },
          };
        }
      } catch (refreshErr) {
        clearAuthData();
        toast.error("Session expired. Please login again.");
        return {
          error: {
            status: 401,
            data: { message: "Refresh failed" },
            message: "Refresh failed",
          },
        };
      }
    }
    return {
      error: {
        status: attempt.res.status,
        data: attempt.responseData,
        message: attempt.res.statusText || "Request failed",
      },
    };
  } catch (err: any) {
    console.error("Base query error", err);
    toast.error(err?.message || "Network error - check your connection");
    return {
      error: {
        status: err?.status || 0,
        data: { message: err?.message || "Network error" },
        message: err?.message || "Network error",
      },
    };
  }
};
