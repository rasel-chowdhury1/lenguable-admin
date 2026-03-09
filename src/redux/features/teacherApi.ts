import { baseApi } from "../api/baseApi";

export const teacherApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTeacher: build.query({
      query: () => ({
        url: "/teacher/all-teachers",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTeacherQuery } = teacherApi;
