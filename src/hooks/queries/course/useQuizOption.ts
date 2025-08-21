import { useMutation } from "@tanstack/react-query";
import { courseAPI } from "@/api/endpoints/course.api";
import toast from "react-hot-toast";

export interface IRequestOption {
  content: string
  isCorrect: boolean
  explanation: string
}

export const useCreateQuizOption = (
  courseId: string,
  moduleId: string,
  lessonId: string,
  questionId: string,
  onSuccessCallback?: (data: any) => void
) => {
  return useMutation({
    mutationFn: (data: IRequestOption) =>
      courseAPI.createQuizOption(courseId, moduleId, lessonId, questionId, data),
    onSuccess: (data) => {
      toast.success("Tạo đáp án thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo đáp án.");
    },
  });
};

export const useUpdateQuizOption = (
  courseId: string,
  moduleId: string,
  lessonId: string,
  questionId: string,
  optionId: string,
  onSuccessCallback?: (data: any) => void
) => {
  return useMutation({
    mutationFn: (data: IRequestOption) =>
      courseAPI.updateQuizOption(courseId, moduleId, lessonId, questionId, optionId, data),
    onSuccess: (data) => {
      toast.success("Cập nhật đáp án thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật đáp án.");
    },
  });
};

export const useDeleteQuizOption = (
  courseId: string,
  moduleId: string,
  lessonId: string,
  questionId: string,
  optionId: string,
  onSuccessCallback?: (data: any) => void
) => {
  return useMutation({
    mutationFn: () =>
      courseAPI.deleteQuizOption(courseId, moduleId, lessonId, questionId, optionId),
    onSuccess: (data) => {
      toast.success("Xóa đáp án thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi xóa đáp án.");
    },
  });
};
