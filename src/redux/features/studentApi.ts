import { baseApi } from "../api/baseApi";

export const studentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStudent: build.query({
      query: () => ({
        url: "/student",
        method: "GET",
      }),
      providesTags: ["Student"],
    }),

    addCredits: build.mutation({
      query: ({ studentId, credits }) => ({
        url: `/student/${studentId}/credits`,
        method: "PATCH",
        body: { credits },
      }),
      invalidatesTags: ["Student"],
    }),
  }),
});

export const { useGetStudentQuery, useAddCreditsMutation } = studentApi;
