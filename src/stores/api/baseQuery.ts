"use client";

import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://erp.zojiedatahub.com/api/v1";

export type RequestConfig = {
  url: string;
  method?: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  skipSuccessToast?: boolean;
  isFormData?: boolean;
  sendToken?: boolean;
};

type BaseError = { status: number; data?: any; message?: string };

// Get token from localStorage
const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

// Set token to localStorage
export const setAccessToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

// Clear auth data
export const clearAuthData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
};

// Build URL with params
const buildUrl = (urlPath: string, params?: Record<string, any>) => {
  const url = new URL(`${BASE_URL}${urlPath}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.append(k, String(v));
      }
    });
  }
  return url.toString();
};

export const fetchBaseQueryWithReauth: BaseQueryFn<RequestConfig, unknown, BaseError> = async (args) => {
  const {
    url,
    method = "GET",
    data,
    params,
    headers = {},
    skipSuccessToast = false,
    isFormData = false,
    sendToken = true,
  } = args;

  const makeRequest = async (token?: string) => {
    try {
      const fullUrl = buildUrl(url, params);
      const mergedHeaders: Record<string, string> = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
        ...(token && sendToken ? { Authorization: `Bearer ${token}` } : {}),
      };

      const options: RequestInit = {
        method,
        headers: mergedHeaders,
        credentials: "include",
      };

      if (method !== "GET" && method !== "HEAD" && data !== undefined) {
        options.body = isFormData ? data : JSON.stringify(data);
      }

      console.log({ fullUrl, options });
      const res = await fetch(fullUrl, options).then((response) => {
        console.log("here");
        return response;
      }).catch((error) => {
        console.error("Fetch failed:", error);
        throw error;
      });

      // console.log({ res: await res.json() })
      const contentType = res.headers.get("content-type");
      const responseData = contentType?.includes("application/json") ? await res.json() : await res.text();

      console.log({ responseData });

      return { res, responseData };
    }catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  try {
    const token = getAccessToken() || undefined;
    const attempt = await makeRequest(token);

    if (attempt.res.ok) {
      const body = attempt.responseData as any;

      if (!skipSuccessToast && body?.success && body?.message && body.message !== "success") {
        toast[body?.success ? "success" : "error"](body.message, {
          position: "top-right",
        });
      }

      return { data: attempt.responseData };
    }

    // Handle error responses
    const errorBody = attempt.responseData as any;
    const errorMessage = errorBody?.message || attempt.res.statusText || "Request failed";
    console.log({ errorMessage });

    // Show error toast
    toast.error(errorMessage, {
      position: "top-right",
    });

    // If 401, clear auth data
    if (attempt.res.status === 401) {
      clearAuthData();
    }

    return {
      error: {
        status: attempt.res.status,
        data: errorBody,
        message: errorMessage,
      },
    };
  } catch (err: any) {
    console.error("Base query error", err);
    toast.error(err?.message || "Network error - check your connection", {
      position: "top-right",
    });
    return {
      error: {
        status: err?.status || 0,
        data: { message: err?.message || "Network error" },
        message: err?.message || "Network error",
      },
    };
  }
};
