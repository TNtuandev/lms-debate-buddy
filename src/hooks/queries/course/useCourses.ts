import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseAPI } from "@/api/endpoints/course.api";
import { CourseFilters } from "@/api/types/course.type";
import { instructorAPI } from "@/api/endpoints/Instructor.api";

export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters?: CourseFilters) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  related: (courseId: string) => [...courseKeys.all, "related", courseId] as const,
  faqs: (courseId: string) => [...courseKeys.all, "faqs", courseId] as const,
  faqsUser: (courseId: string) => [...courseKeys.all, "faqsUser", courseId] as const,
  modules: (courseId: string) => [...courseKeys.all, "modules", courseId] as const,
  notes: (courseId: string, lessonId: string) => [...courseKeys.all, "notes", courseId, lessonId] as const,
  modulesForUser: (courseId: string) => [...courseKeys.all, "modulesForUser", courseId] as const,
  modulesDetail: (courseId: string) => [...courseKeys.all, "modulesDetail", courseId] as const,
  review: (courseId: string) => [...courseKeys.all, "review", courseId] as const,
  reviewSummary: (courseId: string) => [...courseKeys.all, "reviewSummary", courseId] as const,
  instructor: (courseId: string) => [...courseKeys.all, "instructor", courseId] as const,
};

export const useCourses = (filters?: CourseFilters) => {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: () => courseAPI.getCourses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCoursesCMS = (filters?: CourseFilters) => {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: () => courseAPI.getCoursesCMS(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCourseById = (id: string) => {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseAPI.getCourseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseBySlug = (slug: string) => {
  return useQuery({
    queryKey: courseKeys.detail(slug),
    queryFn: () => courseAPI.getCourseBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseCMSBySlug = (slug: string) => {
  return useQuery({
    queryKey: courseKeys.detail(slug),
    queryFn: () => courseAPI.getCourseCMSBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRelatedCourses = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.related(courseId),
    queryFn: () => courseAPI.getRelatedCourses(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFAQs = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.faqs(courseId),
    queryFn: () => courseAPI.getFAQs(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFAQUser = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.faqs(courseId),
    queryFn: () => courseAPI.getFAQsUser(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useModule = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.modules(courseId),
    queryFn: () => courseAPI.getModule(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNote = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: courseKeys.notes(courseId, lessonId),
    queryFn: () => courseAPI.getNote(courseId, lessonId),
    enabled: !!courseId && !!lessonId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useModuleForUser = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.modulesForUser(courseId),
    queryFn: () => courseAPI.getModuleForUser(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReview = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.review(courseId),
    queryFn: () => courseAPI.getReview(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReviewSummary = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.reviewSummary(courseId),
    queryFn: () => courseAPI.getReviewSummary(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInstructorProfile = (userId: string) => {
  return useQuery({
    queryKey: courseKeys.review(userId),
    queryFn: () => instructorAPI.getInstructorProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateNote = (courseId: string, lessonId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ noteId, content }: { noteId: string; content: string }) =>
      courseAPI.updateNote(courseId, lessonId, noteId, { content }),
    onSuccess: () => {
      // Invalidate and refetch notes
      queryClient.invalidateQueries({
        queryKey: courseKeys.notes(courseId, lessonId)
      });
    },
  });
};

export const useCreateNote = (courseId: string, lessonId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (noteData: { timestampSec: number; content: string }) =>
      courseAPI.createNote(courseId, lessonId, noteData),
    onSuccess: () => {
      // Invalidate and refetch notes
      queryClient.invalidateQueries({
        queryKey: courseKeys.notes(courseId, lessonId)
      });
    },
  });
};

export const useDeleteNote = (courseId: string, lessonId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (noteId: string) =>
      courseAPI.deleteNote(courseId, lessonId, noteId),
    onSuccess: () => {
      // Invalidate and refetch notes
      queryClient.invalidateQueries({
        queryKey: courseKeys.notes(courseId, lessonId)
      });
    },
  });
};