import { useQuery } from "@tanstack/react-query";
import { studentAPI } from "@/api/endpoints/student.api";

export const useStudent = (studentId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["studentId", studentId],
    queryFn: () => studentAPI.getStudentProfile(studentId),
    enabled: enabled ?? !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useWishList = (studentId: string) => {
  return useQuery({
    queryKey: ["useWishList", studentId],
    queryFn: () => studentAPI.getWishList(studentId),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useReviewUser = (studentId: string) => {
  return useQuery({
    queryKey: ["useReviewUser", studentId],
    queryFn: () => studentAPI.getReviewUser(studentId),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAttemptsUser = (studentId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["attempts", studentId],
    queryFn: () => studentAPI.getAttemptsUser(studentId),
    enabled: enabled ?? !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubmissionUser = (studentId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["Submission", studentId],
    queryFn: () => studentAPI.getSubmissionUser(studentId),
    enabled: enabled ?? !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};
