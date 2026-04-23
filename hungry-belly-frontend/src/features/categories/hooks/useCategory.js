import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategoriesApi,
  fetchCategoryByIdApi,
  fetchCategoryTreeApi,
  updateCategoryApi,
} from "../api/categoryService";

export const useListCategories = () => {
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoriesApi,
  });

  return { categories, isLoadingCategories };
};

export const useGetCategoryById = (id) => {
  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => fetchCategoryByIdApi(id),
  });

  return { category, isLoadingCategory };
};

export const useGetCategoryTree = () => {
  const { data: categoryTree, isLoading: isLoadingCategoryTree } = useQuery({
    queryKey: ["categories", "tree"],
    queryFn: fetchCategoryTreeApi,
  });

  return { categoryTree, isLoadingCategoryTree };
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateCategory } = useMutation({
    mutationFn: ({ id, data }) => updateCategoryApi(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // Invalidate the categories query
      queryClient.invalidateQueries(
        { queryKey: ["categories", data.id] },
        { exact: true },
      ); // Update the individual category query with the new data
    },
  });

  return { updateCategory };
};
