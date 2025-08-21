import { useMutation, useQuery } from "@tanstack/react-query";
import { courseAPI } from "@/api/endpoints/course.api";
import toast from "react-hot-toast";
import { courseKeys } from "@/hooks/queries/course/useCourses";
import {CourseFilters} from "@/api/types/course.type";

export interface IRequestArticles {
    duration?: number
    title?: string
    shortDescription?: string
    description?: string
    order?: number
    isPreviewable?: boolean
    attachmentUrl?: string
    htmlContent?: string
}

export interface IRequestVideos {
    duration?: number
    title?: string
    shortDescription?: string
    description?: string
    order?: number
    isPreviewable?: boolean
    attachmentUrl?: string
    videoUrl?: string
    notes?: string
}

export interface IRequestQuizz {
    title: string
    description: string
    order: number
    duration: number
    isViewTimeLimit: boolean
    feedbackMode: string
    passingScore: number
    maxAttempts: number
    autoStart: boolean
    questionLayout: string
    questionViewMode: string
    showQuestionCount: boolean
    shortAnswerCharLimit: number
    essayCharLimit: number
    questions: any[]
}

export interface IRequestPractices {
    duration?: number
    title: string
    shortDescription: string
    description: string
    order?: number
    isPreviewable?: boolean
    attachmentUrl?: string
    practiceType: string
    notes?: string
}
export const lessonKeys = {
    all: ["lesson"] as const,
    lists: () => [...lessonKeys.all, "list"] as const,
    list: (filters?: CourseFilters) => [...lessonKeys.lists(), filters] as const,
    details: () => [...lessonKeys.all, "detail"] as const,
    detail: (id: string) => [...lessonKeys.details(), id] as const,
    related: (courseId: string) => [...lessonKeys.all, "related", courseId] as const,
    faqs: (courseId: string) => [...lessonKeys.all, "faqs", courseId] as const,
    modules: (courseId: string) => [...lessonKeys.all, "modules", courseId] as const,
    review: (courseId: string) => [...lessonKeys.all, "review", courseId] as const,
    instructor: (courseId: string) => [...lessonKeys.all, "instructor", courseId] as const,
};

export const useGetLessonByModule = (courseId: string, moduleId: string) => {
  return useQuery({
    queryKey: courseKeys.modules(courseId),
    queryFn: () => courseAPI.getLesson(courseId, moduleId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetLessonById = (courseId: string, moduleId: string, lessonId: string) => {
    return useQuery({
        queryKey: courseKeys.detail(lessonId),
        queryFn: () => courseAPI.getLessonById(courseId, moduleId, lessonId),
        enabled: !!lessonId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreateLessonArticle = (courseId: string, moduleId: string, onSuccessCallback?: (data: any) => void) => {
    return useMutation({
        mutationFn: (data: IRequestArticles) => courseAPI.createLessonArticle(courseId, moduleId, data),
        onSuccess: (data) => {
            toast.success("Tạo bài học dạng bài viết thành công!");
            onSuccessCallback?.(data);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo bài học dạng bài viết.");
        },
    });
};

export const useUpdateLessonArticle = (courseId: string, moduleId: string, lessonId: string, onSuccessCallback?: (data: any) => void) => {
    return useMutation({
        mutationFn: (data: IRequestArticles) => courseAPI.updateLessonArticle(courseId, moduleId, lessonId, data),
        onSuccess: (data) => {
            toast.success("Cập nhật bài học dạng bài viết thành công!");
            onSuccessCallback?.(data);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật bài học dạng bài viết.");
        },
    });
};

export const useCreateLessonVideo = (courseId: string, moduleId: string, onSuccessCallback?: (data: any) => void) => {
    return useMutation({
        mutationFn: (data: IRequestVideos) => courseAPI.createLessonVideo(courseId, moduleId, data),
        onSuccess: (data) => {
            toast.success("Tạo bài học dạng video thành công!");
            onSuccessCallback?.(data);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo bài học dạng video.");
        },
    });
};

export const useUpdateLessonVideo = (courseId: string, moduleId: string, lessonId: string, onSuccessCallback?: (data: any) => void) => {
    return useMutation({
        mutationFn: (data: IRequestVideos) => courseAPI.updateLessonVideo(courseId, moduleId, lessonId, data),
        onSuccess: (data) => {
            toast.success("Cập nhật bài học dạng video thành công!");
            onSuccessCallback?.(data);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật bài học dạng video.");
        },
    });
};

export const useCreateLessonQuiz = (courseId: string, moduleId: string, onSuccessCallback?: (data: any) => void) => {
    return useMutation({
        mutationFn: (data: IRequestQuizz) => courseAPI.createLessonQuiz(courseId, moduleId, data),
        onSuccess: (data) => {
            toast.success("Tạo bài học dạng quiz thành công!");
            onSuccessCallback?.(data);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo bài học dạng quiz.");
        },
    });
};

export const useUpdateLessonQuiz = (courseId: string, moduleId: string, lessonId: string, onSuccessCallback?: (data: any) => void) => {
    return useMutation({
        mutationFn: (data: IRequestQuizz) => courseAPI.updateLessonQuiz(courseId, moduleId, lessonId, data),
        onSuccess: (data) => {
            toast.success("Cập nhật bài học dạng quiz thành công!");
            onSuccessCallback?.(data);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật bài học dạng quiz.");
        },
    });
};

export const useCreateLessonPractice = (courseId: string, moduleId: string, onSuccessCallback?: (data: any) => void) => {
    return useMutation({
        mutationFn: (data: IRequestPractices) => courseAPI.createLessonPractice(courseId, moduleId, data),
        onSuccess: (data) => {
            toast.success("Tạo bài học dạng thực hành thành công!");
            onSuccessCallback?.(data);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo bài học dạng thực hành.");
        },
    });
};

export const useUpdateLessonPractice = (courseId: string, moduleId: string, lessonId: string, onSuccessCallback?: (data: any) => void) => {
    return useMutation({
        mutationFn: (data: IRequestPractices) => courseAPI.updateLessonPractice(courseId, moduleId, lessonId, data),
        onSuccess: (data) => {
            toast.success("Cập nhật bài học dạng thực hành thành công!");
            onSuccessCallback?.(data);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật bài học dạng thực hành.");
        },
    });
};

export const usePublishLesson = (courseId: string, moduleId: string, lessonId: string, onSuccessCallback?: (data: any) => void) => {
    return useMutation({
        mutationFn: () => courseAPI.publishLesson(courseId, moduleId, lessonId),
        onSuccess: (data) => {
            toast.success("Đã xuất bản bài học thành công!");
            onSuccessCallback?.(data);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi xuất bản bài học.");
        },
    });
};

export const useDraftLesson = (courseId: string, moduleId: string, lessonId: string, onSuccessCallback?: (data: any) => void) => {
    return useMutation({
        mutationFn: () => courseAPI.draftLesson(courseId, moduleId, lessonId),
        onSuccess: (data) => {
            toast.success("Đã chuyển bài học về trạng thái nháp!");
            onSuccessCallback?.(data);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi chuyển bài học về trạng thái nháp.");
        },
    });
};

export const useArchiveLesson = (courseId: string, moduleId: string, lessonId: string, onSuccessCallback?: (data: any) => void) => {
    return useMutation({
        mutationFn: () => courseAPI.archiveLesson(courseId, moduleId, lessonId),
        onSuccess: (data) => {
            toast.success("Đã lưu trữ bài học thành công!");
            onSuccessCallback?.(data);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi lưu trữ bài học.");
        },
    });
};
