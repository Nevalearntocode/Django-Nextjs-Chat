import { baseApi } from "../base-api";

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const categorySlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: "/api/categories",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCategoriesQuery } = categorySlice;
