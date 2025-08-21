import { useMutation } from "@tanstack/react-query";
import { courseAPI } from "@/api/endpoints/course.api";
import toast from "react-hot-toast";

export interface IRequestQuestion {
    content: string
    type: string
    order: number
}

export const useCreateQuizQuestion = (
  courseId: string,
  moduleId: string,
  lessonId: string,
  onSuccessCallback?: (data: any) => void
) => {
  return useMutation({
    mutationFn: (data: IRequestQuestion) =>
      courseAPI.createQuizQuestion(courseId, moduleId, lessonId, data),
    onSuccess: (data) => {
      toast.success("Tạo câu hỏi thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo câu hỏi.");
    },
  });
};

export const useUpdateQuizQuestion = (
  courseId: string,
  moduleId: string,
  lessonId: string,
  questionId: string,
  onSuccessCallback?: (data: any) => void
) => {
  return useMutation({
    mutationFn: (data: IRequestQuestion) =>
      courseAPI.updateQuizQuestion(courseId, moduleId, lessonId, questionId, data),
    onSuccess: (data) => {
      toast.success("Cập nhật câu hỏi thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật câu hỏi.");
    },
  });
};

export const usePublishQuizQuestion = (
  courseId: string,
  moduleId: string,
  lessonId: string,
  questionId: string,
  onSuccessCallback?: (data: any) => void
) => {
  return useMutation({
    mutationFn: () =>
      courseAPI.publishQuizQuestion(courseId, moduleId, lessonId, questionId),
    onSuccess: (data) => {
      toast.success("Đã xuất bản câu hỏi thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi xuất bản câu hỏi.");
    },
  });
};

export const useDraftQuizQuestion = (
  courseId: string,
  moduleId: string,
  lessonId: string,
  questionId: string,
  onSuccessCallback?: (data: any) => void
) => {
  return useMutation({
    mutationFn: () =>
      courseAPI.draftQuizQuestion(courseId, moduleId, lessonId, questionId),
    onSuccess: (data) => {
      toast.success("Đã chuyển câu hỏi về trạng thái nháp!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi chuyển câu hỏi về trạng thái nháp.");
    },
  });
};

export const useArchiveQuizQuestion = (
  courseId: string,
  moduleId: string,
  lessonId: string,
  questionId: string,
  onSuccessCallback?: (data: any) => void
) => {
  return useMutation({
    mutationFn: () =>
      courseAPI.archiveQuizQuestion(courseId, moduleId, lessonId, questionId),
    onSuccess: (data) => {
      toast.success("Đã lưu trữ câu hỏi thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi lưu trữ câu hỏi.");
    },
  });
};
  