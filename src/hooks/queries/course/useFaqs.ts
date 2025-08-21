import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { courseAPI } from "@/api/endpoints/course.api";
import toast from "react-hot-toast";

export interface IRequestFaq {
  question: string
  answer: string
}

export const useCreateFAQ = (courseId: string, onSuccessCallback?: (data: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IRequestFaq) => courseAPI.createFAQ(courseId, data),
    onSuccess: (data) => {
      toast.success("Tạo FAQ thành công!");
      queryClient.invalidateQueries({ queryKey: ["courses", "faqs", courseId] });
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo FAQ.");
    },
  });
};

export const useUpdateFAQ = (courseId: string, faqId: string, onSuccessCallback?: (data: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IRequestFaq) => courseAPI.updateFAQ(courseId, faqId, data),
    onSuccess: (data) => {
      toast.success("Cập nhật FAQ thành công!");
      queryClient.invalidateQueries({ queryKey: ["courses", "faqs", courseId] });
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật FAQ.");
    },
  });
};

export const useDeleteFAQ = (courseId: string, faqId: string, onSuccessCallback?: (data: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => courseAPI.deleteFAQ(courseId, faqId),
    onSuccess: (data) => {
      toast.success("Xóa FAQ thành công!");
      queryClient.invalidateQueries({ queryKey: ["courses", "faqs", courseId] });
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi xóa FAQ.");
    },
  });
};

export const usePublishFAQ = (courseId: string, faqId: string, onSuccessCallback?: (data: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => courseAPI.publishFAQ(courseId, faqId),
    onSuccess: (data) => {
      toast.success("Đã xuất bản FAQ thành công!");
      queryClient.invalidateQueries({ queryKey: ["courses", "faqs", courseId] });
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi xuất bản FAQ.");
    },
  });
};

export const useDraftFAQ = (courseId: string, faqId: string, onSuccessCallback?: (data: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => courseAPI.draftFAQ(courseId, faqId),
    onSuccess: (data) => {
      toast.success("Đã chuyển FAQ về trạng thái nháp!");
      queryClient.invalidateQueries({ queryKey: ["courses", "faqs", courseId] });
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi chuyển FAQ về trạng thái nháp.");
    },
  });
};

export const useFAQs = (courseId: string) => {
  return useQuery({
    queryKey: ["courses", "faqs", courseId],
    queryFn: () => courseAPI.getFAQs(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};
