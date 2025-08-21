import api from "@/api/api";
import { LearnerProfile } from "@/api/types/intructor.type";
import {
  ILessonAttemptResponsive,
  ILessonSubmissionResponsive
} from "@/api/types/dashboard.type";

export const studentAPI = {
  getStudentProfile: async (userId: string): Promise<LearnerProfile> => {
    const { data } = await api.get(`/learners/${userId}/profile`);
    return data;
  },

  getWishList: async (userId: string): Promise<any> => {
    const { data } = await api.get(`/wishlists`, {
      params: {
        userId: userId,
      },
    });
    return data;
  },

  getReviewUser: async (userId: string): Promise<any> => {
    const { data } = await api.get(`/users/${userId}/reviews`);
    return data;
  },

  getAttemptsUser: async (userId: string): Promise<ILessonAttemptResponsive> => {
    const { data } = await api.get(`/learners/${userId}/attempts`);
    return data;
  },

  getSubmissionUser: async (userId: string): Promise<ILessonSubmissionResponsive> => {
    const { data } = await api.get(`/learners/${userId}/submission`);
    return data;
  },
};
