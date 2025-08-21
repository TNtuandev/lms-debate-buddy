import { useMutation } from "@tanstack/react-query";
import { authAPI } from "@/api/endpoints/auth.api";

interface UploadCoverPhotoData {
  coverPhotoUrl: string;
  attachmentId: string;
}

export const useUploadCoverPhoto = () => {
  return useMutation({
    mutationFn: (coverData: UploadCoverPhotoData) => authAPI.uploadCoverPhoto(coverData),
  });
}; 