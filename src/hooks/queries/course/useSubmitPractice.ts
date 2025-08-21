import { useQuery, useMutation } from "@tanstack/react-query";
import { trackingAPI } from "@/api/endpoints/tracking.api";
import toast from "react-hot-toast";

export const submitPracticeKeys = {
  all: ["submitPractice"] as const,
  details: () => [...submitPracticeKeys.all, "detail"] as const,
  detail: (courseId: string, lessonId: string) => [...submitPracticeKeys.details(), courseId, lessonId] as const,
  file: (courseId: string, lessonId: string) => [...submitPracticeKeys.detail(courseId, lessonId), "file"] as const,
  code: (courseId: string, lessonId: string) => [...submitPracticeKeys.detail(courseId, lessonId), "code"] as const,
  writing: (courseId: string, lessonId: string) => [...submitPracticeKeys.detail(courseId, lessonId), "writing"] as const,
};

export const useGetPracticeSubmission = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: submitPracticeKeys.detail(courseId, lessonId),
    queryFn: () => trackingAPI.getPracticeTracking(courseId, lessonId),
    enabled: !!courseId && !!lessonId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubmitPracticeCode = (courseId: string, lessonId: string, onSuccessCallback?: (data: any) => void) => {
  return useMutation({
    mutationFn: (data: any) => trackingAPI.submitPracticeCode(courseId, lessonId, data),
    onSuccess: (data) => {
      toast.success("Nộp bài thực hành dạng code thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi nộp bài thực hành dạng code.");
    },
  });
};
