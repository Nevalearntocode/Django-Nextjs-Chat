import { baseApi } from "../base-api";

export type Channel = {
  id: string;
  name: string;
  description: string;
  topic: string;
};

type ChannelQueryParams = {
  serverId?: string;
};

export const channelSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query<Channel[], ChannelQueryParams>({
      query: (args) => {
        let url = "/api/channels/";
        if (args.serverId) {
          url += `?server=${args.serverId}`;
        }
        return {
          url,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetChannelsQuery } = channelSlice;
