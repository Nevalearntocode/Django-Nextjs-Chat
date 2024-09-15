import { baseApi } from "../base-api";

export type Message = {
  id: string;
  sender: string;
  content: string;
  created: string;
  edited: string;
  deleted: boolean;
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
