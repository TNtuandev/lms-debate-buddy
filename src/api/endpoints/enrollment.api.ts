import api from "@/api/api";
import {Enrollment} from "@/hooks/queries/enrollments/enrollment";

export const enrollmentAPI = {
  // Lấy danh sách enrollments
  getEnrollments: async (): Promise<Enrollment[]> => {
    const { data: res } = await api.get(`/enrollments`);
    return res;
  },

  // Lấy chi tiết enrollment theo ID
  getEnrollmentById: async (enrollmentId: string): Promise<Enrollment> => {
    const { data: res } = await api.get(`/enrollments/${enrollmentId}`);
    return res;
  },
}; 