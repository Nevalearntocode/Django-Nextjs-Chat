import { baseApi } from "../base-api";

export type Message = {
  id: number;
  sender: string;
  content: string;
  created: string;
};


export const messageSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], void>({
      query: () => ({
        url: "/api/messages",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMessagesQuery } = messageSlice;
