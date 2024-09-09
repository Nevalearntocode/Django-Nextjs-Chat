import { baseApi } from "../base-api";

export type Channel = {
  id: string;
  name: string;
  description: string;
  topic: string;
};

export const channelSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "/api/channels",
        method: "GET",
      }),
    }),
  }),
});
