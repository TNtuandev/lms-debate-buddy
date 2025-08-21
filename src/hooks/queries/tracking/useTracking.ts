import { useMutation, useQuery } from "@tanstack/react-query";
import { trackingAPI } from "@/api/endpoints/tracking.api";
import toast from "react-hot-toast";

export const useTrackingQuiz = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: ["courseId", courseId, lessonId],
    queryFn: () => trackingAPI.getQuizTracking(courseId, lessonId),
    enabled: !!courseId && !!lessonId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useHistoryTrackingQuiz = (courseId: string, lessonId: string, attemptId: string) => {
  return useQuery({
    queryKey: ["courseId", courseId, lessonId, attemptId],
    queryFn: () => trackingAPI.getHistoryQuizTracking(courseId, lessonId, attemptId),
    enabled: !!courseId && !!lessonId && !!attemptId,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePracticeTracking = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: ["PracticeTracking", courseId, lessonId],
    queryFn: () => trackingAPI.getPracticeTracking(courseId, lessonId),
    enabled: !!courseId && !!lessonId,
    staleTime: 5 * 60 * 1000,
  });
};


export const useCreateAttemptsQuiz = (courseId: string, lessonId: string) => {
  return useMutation({
    mutationFn: () => trackingAPI.createQuizAttempts(courseId, lessonId),
    onSuccess: (data) => {
      console.log(data);
    },
  });
};

export const useSubmitQuiz = (courseId: string, lessonId: string, attemptId: string) => {
  return useMutation({
    mutationFn: (data: any) => trackingAPI.submitQuizAttempts(courseId, lessonId, attemptId, data),
    onSuccess: () => {
      toast.success("Submit quiz thành công!");
    },
  });
};

export const useSubmitPracticeWriting = (courseId: string, lessonId: string) => {
  return useMutation({
    mutationFn: (data: any) => trackingAPI.submitPracticeWriting(courseId, lessonId, data),
    onSuccess: () => {
      toast.success("Submit bài học thành công!");
    },
  });
};

export const useSubmitPracticeFile = (courseId: string, lessonId: string) => {
  return useMutation({
    mutationFn: (data: any) => trackingAPI.submitPracticeFile(courseId, lessonId, data),
    onSuccess: () => {
      toast.success("Submit bài học thành công!");
    },
  });
};
