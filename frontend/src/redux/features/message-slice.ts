import { baseApi } from "../base-api";

export type Message = {
  id: number;
  sender: string;
  content: string;
  created: string;
};

export type MessageQueryParams = {
  channelId?: string;
};

export const messageSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], MessageQueryParams>({
      query: (args) => {
        let url = `/api/messages/`;
        if (args.channelId) {
          url += `?channel=${args.channelId}`;
        }
        return {
          url,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetMessagesQuery } = messageSlice;
