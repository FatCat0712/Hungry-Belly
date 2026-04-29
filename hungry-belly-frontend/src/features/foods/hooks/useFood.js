import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFoodApi,
  deleteFoodApi,
  getFoodByIdApi,
  getFoodsApi,
  updateFoodApi,
  updateFoodStatusApi,
} from "../api/foodService";

export const useListFoodsByPage = ({
  pageNum,
  pageSize,
  sortField,
  sortDirection,
  keyword,
}) => {
  const { data: page, isLoading } = useQuery({
    queryKey: ["foods", pageNum, pageSize, sortField, sortDirection, keyword],
    queryFn: () =>
      getFoodsApi({ pageNum, pageSize, sortField, sortDirection, keyword }),
  });

  return { page, isLoading };
};

export const useGetFoodById = (id) => {
  const { data, isLoading } = useQuery({
    queryKey: ["food", id],
    queryFn: () => getFoodByIdApi(id),
    enabled: Boolean(id),
  });

  return { food: data, isLoading };
};

export const useCreateFood = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: createFood } = useMutation({
    mutationFn: (data) => createFoodApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });

  return { createFood };
};

export const useUpdateFood = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateFood } = useMutation({
    mutationFn: ({ id, data }) => updateFoodApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });

  return { updateFood };
};

export const useUpdateFoodStatus = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateFoodStatus } = useMutation({
    mutationFn: (id) => updateFoodStatusApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });

  return { updateFoodStatus };
};

export const useDeleteFood = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteFood } = useMutation({
    mutationFn: (id) => deleteFoodApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });

  return { deleteFood };
};

const normalizeImages = (images) => {
  let displayOrder = 0;
  let coverAssigned = false;

  return images.map((image) => {
    if (image.status === "removed") {
      return {
        ...image,
        isPrimary: false,
        type: "GALLERY",
      };
    }

    const isCover = !coverAssigned;
    if (isCover) {
      coverAssigned = true;
    }

    return {
      ...image,
      isPrimary: isCover,
      type: isCover ? "COVER" : "GALLERY",
      displayOrder: displayOrder++,
    };
  });
};

export const appendUploadedFoodImages = (currentImages, uploads) => {
  const uploadedImages = uploads.map((image) => ({
    url: image.publicUrl,
    path: image.path,
    status: "new",
  }));

  const activeImages = [
    ...currentImages.filter((image) => image.status !== "removed"),
    ...uploadedImages,
  ];

  const removedImages = currentImages.filter(
    (image) => image.status === "removed",
  );

  return normalizeImages([...activeImages, ...removedImages]);
};

export const removeFoodImagePath = (currentImages, path) => {
  const nextImages = currentImages.map((image) =>
    image.path === path
      ? {
          ...image,
          status: "removed",
          isPrimary: false,
          type: "GALLERY",
        }
      : { ...image },
  );

  const activeImages = nextImages.filter((image) => image.status !== "removed");
  const removedImages = nextImages.filter(
    (image) => image.status === "removed",
  );

  return normalizeImages([...activeImages, ...removedImages]);
};

export const setFoodCoverImageByPath = (currentImages, path) => {
  const targetImage = currentImages.find(
    (image) => image.path === path && image.status !== "removed",
  );

  if (!targetImage) return currentImages;

  const activeImages = currentImages
    .filter((image) => image.status !== "removed")
    .map((image) => ({ ...image }));

  const removedImages = currentImages
    .filter((image) => image.status === "removed")
    .map((image) => ({ ...image }));

  const reorderedActiveImages = [
    activeImages.find((img) => img.path === path),
    ...activeImages.filter((img) => img.path !== path),
  ];

  return normalizeImages([...reorderedActiveImages, ...removedImages]);
};

export const buildFoodImagePayload = (images, uploadId) => {
  return images.map((image) => {
    const { path, type, isPrimary, status, displayOrder, id } = image;
    return { path, type, isPrimary, status, displayOrder, uploadId, id };
  });
};
