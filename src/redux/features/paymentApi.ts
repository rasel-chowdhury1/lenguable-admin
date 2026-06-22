import { baseApi } from "../api/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPayments: build.query({
      query: () => ({
        url: "/payment",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
  }),
});

export const { useGetAllPaymentsQuery } = paymentApi;
