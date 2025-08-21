import { useMutation } from "@tanstack/react-query";
import { CourseDetail, ICreateCourseRequest } from "@/api/types/course.type";
import { courseAPI } from "@/api/endpoints/course.api";
import toast from "react-hot-toast";

export const useCreateCourse = (
  onSuccessCallback?: (data: CourseDetail) => void,
) => {
  const createCourse = useMutation({
    mutationFn: (request: ICreateCourseRequest) =>
      courseAPI.createCourse(request),
    onSuccess: (data) => {
      toast.success("Khóa học đã được tạo thành công!");
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi lưu trữ khóa học.",
      );
    },
  });

  return {
    createCourse,
  };
};

export const useUpdateCourse = (courseId: string) => {
  return  useMutation({
    mutationFn: (request: ICreateCourseRequest) =>
      courseAPI.updateCourse(request, courseId),
    onSuccess: () => {
      toast.success("Chỉnh sửa khóa học thành công!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi lưu trữ khóa học.",
      );
    },
  });
};