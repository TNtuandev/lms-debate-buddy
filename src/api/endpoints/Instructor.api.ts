import api from "@/api/api";
import { IntructorResponsive } from "@/api/types/intructor.type";


export const instructorAPI = {
  getInstructorProfile: async (userId: string): Promise<IntructorResponsive> => {
    const { data } = await api.get(`/instructors/${userId}/profile`);
    return data;
  },
};