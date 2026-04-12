import { baseApi } from "../api/baseApi";

const reminderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendReminder: builder.mutation({
      query: (timeLabel: "24h" | "2h") => ({
        url: "/reminder/send",
        method: "POST",
        body: { timeLabel },
      }),
    }),
  }),
});

export const { useSendReminderMutation } = reminderApi;
