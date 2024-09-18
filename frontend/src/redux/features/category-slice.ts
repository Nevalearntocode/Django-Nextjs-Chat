import { baseApi } from "../base-api";
import { FormType as CategoryForm } from "@/components/modals/add-category-modal";

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
        url: "/api/categories/",
        method: "GET",
      }),
      providesTags: (categories) =>
        categories
          ? [
              ...categories.map(({ id }) => ({
                type: "categories" as const,
                id,
              })),
              { type: "categories", id: "list" },
            ]
          : [{ type: "categories", id: "list" }],
    }),
    addCategory: builder.mutation<Category, CategoryForm>({
      query: (category) => {
        const formData = new FormData();

        for (const [key, value] of Object.entries(category)) {
          formData.append(key, value as string);
        }

        return {
          url: "/api/categories/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "categories", id: "list" }],
    }),
  }),
});

export const { useGetCategoriesQuery, useAddCategoryMutation } = categorySlice;
