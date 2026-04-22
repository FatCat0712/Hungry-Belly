import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRestaurantApi,
  getRestaurantByIdApi,
  getRestaurantsApi,
  updateRestaurantApi,
  updateRestaurantStatusApi,
} from "../api/restaurantService";

export const useGetRestaurantById = (restaurantId) => {
  const { data, isLoading } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => getRestaurantByIdApi(restaurantId),
  });

  return { restaurant: data || {}, isLoading };
};

export const useListRestaurantsByPage = ({
  pageNum,
  pageSize,
  sortField,
  sortDirection,
  keyword,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [
      "restaurants",
      pageNum,
      pageSize,
      sortField,
      sortDirection,
      keyword,
    ],
    queryFn: () =>
      getRestaurantsApi({
        pageNum,
        pageSize,
        sortField,
        sortDirection,
        keyword,
      }),
  });

  return { data, isLoading };
};

export const useUpdateRestaurantStatus = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateRestaurantStatus } = useMutation({
    mutationFn: (restaurantId) => updateRestaurantStatusApi(restaurantId),
    onSuccess: () => {
      // Invalidate both the paginated list and individual restaurant queries to ensure fresh data
      queryClient.invalidateQueries(["restaurants"]);
    },
  });

  return { updateRestaurantStatus };
};

export const useRestaurantDetail = (restaurantId) => {
  const query = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => getRestaurantByIdApi(restaurantId),
    enabled: Boolean(restaurantId),
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) {
        return false;
      }

      return failureCount < 1;
    },
  });

  return {
    ...query,
    data: query.data,
  };
};

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateRestaurant } = useMutation({
    mutationFn: ({ id, data }) => updateRestaurantApi(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries(
        { queryKey: ["restaurant", data.id] },
        { exact: true },
      ); // Update the individual restaurant query with the new data
    },
  });

  return { updateRestaurant };
};

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: createRestaurant } = useMutation({
    mutationFn: (data) => createRestaurantApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  return { createRestaurant };
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

export const appendUploadedImages = (currentImages, uploads) => {
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

export const removeImagePath = (currentImages, path) => {
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

export const setCoverImageByPath = (currentImages, path) => {
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

export const buildRestaurantImagePayload = (images, uploadId) => {
  return images.map((image) => {
    const { path, type, isPrimary, status, displayOrder, id } = image;
    return { path, type, isPrimary, status, displayOrder, uploadId, id };
  });
};
