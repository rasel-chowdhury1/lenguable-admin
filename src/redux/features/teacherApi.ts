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
    deleteTeacher: build.mutation({
      query: (id: string) => ({
        url: `/teacher/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teacher"],
    }),
  }),
});

export const { useGetTeacherQuery, useDeleteTeacherMutation } = teacherApi;