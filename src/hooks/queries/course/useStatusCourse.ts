import { useMutation } from "@tanstack/react-query";
import { courseAPI } from "@/api/endpoints/course.api";
import toast from "react-hot-toast";
import { CourseDetail } from "@/api/types/course.type";

export const useStatusCourse = (
  onSuccessCallback?: (data: CourseDetail) => void,
) => {
  const archiveCourse = useMutation({
    mutationFn: (id: string) => courseAPI.archiveCourse(id),
    onSuccess: (data) => {
      toast.success("Khóa học đã được lưu trữ thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      console.error("Error archiving course:", error);
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi lưu trữ khóa học.",
      );
    },
  });

  const draftCourse = useMutation({
    mutationFn: (id: string) => courseAPI.draftCourse(id),
    onSuccess: (data) => {
      toast.success("Khóa học đã được chuyển về bản nháp thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi lưu trữ khóa học.",
      );
      toast.error("Đã xảy ra lỗi khi chuyển khóa học về bản nháp.");
    },
  });

  const publishCourse = useMutation({
    mutationFn: (id: string) => courseAPI.publishCourse(id),
    onSuccess: (data) => {
      toast.success("Khóa học đã được xuất bản thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi lưu trữ khóa học.",
      );
      toast.error("Đã xảy ra lỗi khi xuất bản khóa học.");
    },
  });

  return {
    archiveCourse,
    draftCourse,
    publishCourse,
  };
};

export enum EStatusCourse {
  PUBLIC = "PUBLIC",
  DRAFT = "DRAFT",
  ARCHIVED = "ARCHIVED",
  PUBLISHED = "PUBLISHED",
}
