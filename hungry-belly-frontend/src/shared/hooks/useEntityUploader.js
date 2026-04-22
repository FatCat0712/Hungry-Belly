import { useEffect, useState } from "react";
import {
  useCreateTempSession,
  useGetPresignedUrl,
  useUploadPhoto,
} from "./useStorage";

export const useEntityUploader = ({ queryKey, entityType }) => {
  const [uploadId, setUploadId] = useState(null);
  const { createTempSession } = useCreateTempSession();
  const { getPresignedUrl } = useGetPresignedUrl(queryKey);
  const { uploadPhoto } = useUploadPhoto();

  useEffect(() => {
    async function init() {
      if (uploadId) return;
      const nextUploadId = await createTempSession();
      setUploadId(nextUploadId);
    }
    init();
  }, [createTempSession, uploadId]);

  const uploadFiles = async (files) => {
    if (!files.length || !uploadId) return;

    const uploads = await getPresignedUrl({
      uploadId,
      files: files.map((file) => ({
        fileName: file.name,
        contentType: file.type,
      })),
      entityType,
    });

    if (!uploads.length) return;

    await Promise.all(
      uploads.map(async (u, index) => {
        await uploadPhoto({
          uploadUrl: u.uploadUrl,
          file: files[index],
          contentType: files[index].type,
        });
      }),
    );

    return uploads;
  };

  return {
    uploadId,
    uploadFiles,
  };
};
