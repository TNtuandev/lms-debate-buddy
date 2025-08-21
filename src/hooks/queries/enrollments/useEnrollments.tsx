import { useQuery } from "@tanstack/react-query";
import { enrollmentAPI } from "@/api/endpoints/enrollment.api";

// Hook lấy danh sách enrollments
export const useGetEnrollments = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: () => enrollmentAPI.getEnrollments(),
    staleTime: 5 * 60 * 1000, // 5 phút
    enabled: enabled,
  });
};

// Hook lấy chi tiết enrollment theo ID
export const useGetEnrollmentById = (enrollmentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["enrollment", enrollmentId],
    queryFn: () => enrollmentAPI.getEnrollmentById(enrollmentId),
    staleTime: 5 * 60 * 1000, // 5 phút
    enabled: enabled && !!enrollmentId,
  });
};
