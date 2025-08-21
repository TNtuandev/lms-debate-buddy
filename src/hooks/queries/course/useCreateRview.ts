import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ICreateReviewRequest } from "@/api/types/course.type";
import { courseAPI } from "@/api/endpoints/course.api";
import toast from "react-hot-toast";

export const useCreateReview = (productId?: string, onSuccessCallback?: (data: any) => void) => {
  const queryClient = useQueryClient();
  
  const createReview = useMutation({
    mutationFn: (request: ICreateReviewRequest) =>
      courseAPI.createReview(request),
    onSuccess: (data) => {
      toast.success("Đánh giá khóa học thành công!");
      
      // Invalidate và refetch review data
      if (productId) {
        queryClient.invalidateQueries({ 
          queryKey: ["courses", "review", productId] 
        });
      }
      
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi đánh giá.",
      );
    },
  });

  return {
    createReview,
    isLoading: createReview.isPending,
    error: createReview.error,
  };
};