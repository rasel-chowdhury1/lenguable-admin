import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getToken = () => {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "accessToken") return value;
  }
  return null;
};

const clearTokens = () => {
  if (typeof document !== "undefined") {
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
  }
};

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://10.10.28.45:5000/api/v1",
  baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithLogout = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithLogout,
  tagTypes: [
    "Auth",
    "User",
    "Lesson",
    "Resource",
    "Student",
    "Teacher",
    "Hero",
    "HowItWorks",
    "WhatYouGet",
    "OurStory",
    "FAQ",
    "CTA",
    "CTA2",
    "DiscountCode",
    "About",
    "Booking",
    "Payment",
  ],
  endpoints: () => ({}),
});

export { clearTokens };
