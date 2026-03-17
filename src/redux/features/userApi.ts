import { baseApi } from "../api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createTeacher: build.mutation({
      query: (data) => ({
        url: "/teacher",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getMe: build.query({
      query: () => ({
        url: "/user/getMe",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateTeacherMutation, useGetMeQuery } = userApi;
