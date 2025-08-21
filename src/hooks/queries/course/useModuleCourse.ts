import { useQuery, useMutation } from "@tanstack/react-query";
import { courseAPI } from "@/api/endpoints/course.api";
import toast from "react-hot-toast";

export interface IRequestModule {
  title: string;
  shortDescription: string;
  order?: number;
}

export interface IReorderModules {
  moduleIds: string[];
}

export interface IModule {
  id: string
  title: string
  shortDescription: string
  order?: number
  lessons: any[]
  isExpanded?: boolean;
}


export const moduleKeys = {
  all: ["modules"] as const,
  lists: () => [...moduleKeys.all, "list"] as const,
  list: (courseId: string) => [...moduleKeys.lists(), courseId] as const,
};

export const useModules = (courseId: string) => {
  return useQuery({
    queryKey: moduleKeys.list(courseId),
    queryFn: (): Promise<{data: IModule[]}> => courseAPI.getModules(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


export const useCreateModule = (courseId: string, onSuccessCallback?: (data: any) => void) => {
  return useMutation({
    mutationFn: (moduleData: IRequestModule) => courseAPI.createModule(courseId, moduleData),
    onSuccess: (data) => {
      console.log("Module created successfully:", data);
      toast.success("Module đã được tạo thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      console.error("Error creating module:", error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo module.");
    },
  });
};

export const useUpdateModule = (courseId: string, moduleId: string) => {
  return useMutation({
    mutationFn: (moduleData: IRequestModule) => courseAPI.updateModule(courseId, moduleId, moduleData),
    onSuccess: (data) => {
      console.log("Module created successfully:", data);
      toast.success("Chủ đề đã được cập nhật thành công!");
    },
    onError: (error: any) => {
      console.error("Error creating module:", error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật module.");
    },
  });
};

export const useReorderModules = (courseId: string, onSuccessCallback?: (data: any) => void) => {
  return useMutation({
    mutationFn: (reorderData: IReorderModules) => courseAPI.reorderModules(courseId, reorderData),
    onSuccess: (data) => {
      toast.success("Thứ tự module đã được cập nhật thành công!");
      onSuccessCallback?.(data);
    },
    onError: (error: any) => {
      console.error("Error reordering modules:", error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi sắp xếp lại module.");
    },
  });
};

