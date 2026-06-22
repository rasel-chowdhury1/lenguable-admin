import { baseApi } from "../api/baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllBookings: build.query({
      query: () => ({
        url: "/booking/admin",
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),

    deleteBooking: build.mutation({
      query: (id: string) => ({
        url: `/booking/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const { useGetAllBookingsQuery, useDeleteBookingMutation } = bookingApi;
