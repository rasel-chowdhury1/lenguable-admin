import { baseApi, clearTokens } from "../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
