import { baseApi } from "../base-api";
import { AddChannelForm as ChannelForm } from "@/components/modals/add-channel-modal";
export type Channel = {
  id: string;
  name: string;
  description: string;
  topic: string;
  server_banner: string;
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
      providesTags: (channels) =>
        channels
          ? [
              ...channels.map(({ id }) => ({ type: "channels", id }) as const),
              { type: "channels", id: "list" },
            ]
          : [{ type: "channels", id: "list" }],
    }),
    getChannel: builder.query<Channel, string>({
      query: (id) => ({
        url: `/api/channels/${id}`,
        method: "GET",
      }),
      providesTags: (channel) =>
        channel ? [{ type: "channels", id: channel.id }] : [],
    }),
    addChannel: builder.mutation<Channel, ChannelForm>({
      query: (channel) => ({
        url: "/api/channels/",
        method: "POST",
        body: channel,
      }),
      invalidatesTags: [{ type: "channels", id: "list" }],
    }),
    editChannel: builder.mutation<
      Channel,
      { id: string; name: string; description: string; topic: string }
    >({
      query: (channel) => ({
        url: `/api/channels/${channel.id}/`,
        method: "PUT",
        body: {
          name: channel.name,
          description: channel.description,
          topic: channel.topic,
        },
      }),
      invalidatesTags: (channel) =>
        channel ? [{ type: "channels", id: channel.id }] : [],
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useGetChannelQuery,
  useAddChannelMutation,
  useEditChannelMutation,
} = channelSlice;
