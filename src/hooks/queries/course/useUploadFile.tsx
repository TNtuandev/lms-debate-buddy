import { useMutation } from "@tanstack/react-query";
import { courseAPI } from "@/api/endpoints/course.api";
import toast from "react-hot-toast";

export const useUploadFile = (onSuccessCallback?: (data: any) => void) => {
  const uploadFile = useMutation({
    mutationFn: (formData: FormData) => courseAPI.uploadFile(formData),
    onSuccess: (data) => {
      toast.success("Tải file lên thành công!");
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi tải file lên."
      );
    },
  });

  return {
    uploadFile,
  };
};

export const useUploadMultipleFiles = (onSuccessCallback?: (data: any) => void) => {
  const uploadMultipleFiles = useMutation({
    mutationFn: (formData: FormData) => courseAPI.uploadMultipleFiles(formData),
    onSuccess: (data) => {
      toast.success("Tải nhiều file lên thành công!");
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi tải nhiều file lên."
      );
    },
  });

  return {
    uploadMultipleFiles,
  };
};

export const usePublishLesson = (onSuccessCallback?: (data: any) => void) => {
  const publishLesson = useMutation({
    mutationFn: ({ courseId, moduleId, lessonId }: { courseId: string; moduleId: string; lessonId: string }) =>
      courseAPI.publishLesson(courseId, moduleId, lessonId),
    onSuccess: (data) => {
      toast.success("Xuất bản bài học thành công!");
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi xuất bản bài học."
      );
    },
  });

  return {
    publishLesson,
  };
};
