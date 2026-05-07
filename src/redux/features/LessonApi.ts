import { baseApi } from "../api/baseApi";

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL LESSONS
    getAllLessons: builder.query({
      query: () => ({
        url: "/lesson",
        method: "GET",
      }),
      providesTags: ["Lesson"],
    }),

    // GET SINGLE LESSON
    getSingleLesson: builder.query({
      query: (id: string) => ({
        url: `/lesson/${id}`,
        method: "GET",
      }),
      providesTags: ["Lesson"],
    }),

    createLesson: builder.mutation({
      query: (data) => ({
        url: "/lesson",
        method: "POST",
        body: data, // FormData passed directly
        formData: true,
      }),
      invalidatesTags: ["Lesson"],
    }),

    reorderLessons: builder.mutation<void, string[]>({
      query: (orderedIds) => ({
        url: "/lesson/reorder",
        method: "PATCH",
        body: { orderedIds },
      }),
      invalidatesTags: ["Lesson"],
    }),

    updateLesson: builder.mutation({
      query: ({ id, data }) => ({
        url: `/lesson/${id}`,
        method: "PATCH",
        body: data, // FormData passed directly
        formData: true,
      }),
      invalidatesTags: ["Lesson"],
    }),

    // DELETE LESSON
    deleteLesson: builder.mutation({
      query: (id: string) => ({
        url: `/lesson/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lesson"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllLessonsQuery,
  useGetSingleLessonQuery,
  useCreateLessonMutation,
  useReorderLessonsMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApi;
