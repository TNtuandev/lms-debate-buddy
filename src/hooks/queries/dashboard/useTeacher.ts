import { useQuery } from "@tanstack/react-query";
import { teacherAPI } from "@/api/endpoints/teacher.api";

export const useTeacher = (teacherId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["teacherId", teacherId],
    queryFn: () => teacherAPI.getTeacherProfile(teacherId),
    enabled: enabled ?? !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useWishList = (teacherId: string) => {
  return useQuery({
    queryKey: ["useWishList", teacherId],
    queryFn: () => teacherAPI.getWishList(teacherId),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useReviewUser = (teacherId: string) => {
  return useQuery({
    queryKey: ["useReviewUser", teacherId],
    queryFn: () => teacherAPI.getReviewUser(teacherId),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAttemptsTeacher = (teacherId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["attempts", teacherId],
    queryFn: () => teacherAPI.getAttemptsUser(teacherId),
    enabled: enabled ?? !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubmissionTeacher = (teacherId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["Submission", teacherId],
    queryFn: () => teacherAPI.getSubmissionUser(teacherId),
    enabled: enabled ?? !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
};
