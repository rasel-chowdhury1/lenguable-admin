import { baseApi } from "../api/baseApi";

export const studentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStudent: build.query({
      query: () => ({
        url: "/student",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetStudentQuery } = studentApi;
