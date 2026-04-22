import { baseApi } from "../api/baseApi";

export const teacherApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTeacher: build.query({
      query: () => ({
        url: "/teacher",
        method: "GET",
      }),
       providesTags: ["Teacher"],
    }),
  }),
});

export const { useGetTeacherQuery } = teacherApi;
