import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryApi,
  deleteCategoryApi,
  exportCategoriesApi,
  fetchCategoriesApi,
  fetchCategoryByIdApi,
  fetchCategoryChildrenApi,
  fetchCategoryTreeApi,
  updateCategoryApi,
  updateCategoryStatusApi,
} from "../api/categoryService";

export const useListRootCategories = ({
  pageNum,
  pageSize,
  sortField,
  sortDirection,
  keyword,
}) => {
  const { data: page, isLoading: isLoadingCategories } = useQuery({
    queryKey: [
      "categories",
      "roots",
      { pageNum, pageSize, sortField, sortDirection, keyword },
    ],
    queryFn: () =>
      fetchCategoriesApi({
        pageNum,
        pageSize,
        sortField,
        sortDirection,
        keyword,
      }),
  });

  return { page, isLoadingCategories };
};

export const useLazyLoadCategoryChildren = () => {
  const queryClient = useQueryClient();
  const loadChildren = async (parentId) => {
    return queryClient.fetchQuery({
      queryKey: ["categories", parentId, "children"],
      queryFn: () => fetchCategoryChildrenApi(parentId),
    });
  };
  return { loadChildren };
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

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: createCategory } = useMutation({
    mutationFn: (data) => createCategoryApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { createCategory };
};

export const useUpdateCategoryStatus = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateCategoryStatus } = useMutation({
    mutationFn: (id) => updateCategoryStatusApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { updateCategoryStatus };
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: (id) => deleteCategoryApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { deleteCategory };
};

export const useExportCategories = () => {
  const { mutateAsync: exportCategories } = useMutation({
    mutationFn: (format) => exportCategoriesApi(format),
  });

  return { exportCategories };
};
