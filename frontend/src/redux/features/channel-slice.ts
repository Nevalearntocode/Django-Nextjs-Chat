import { baseApi } from "../base-api";

export type Channel = {};

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
