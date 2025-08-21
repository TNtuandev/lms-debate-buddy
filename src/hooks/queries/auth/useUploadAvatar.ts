import { useMutation } from "@tanstack/react-query";
import { authAPI } from "@/api/endpoints/auth.api";

interface UploadAvatarData {
  avatarUrl: string;
  attachmentId: string;
}

export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: (avatarData: UploadAvatarData) => authAPI.uploadAvatar(avatarData),
  });
}; 