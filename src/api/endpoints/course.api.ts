import {
  CourseFilters,
  CoursesResponse,
  CourseDetail,
  ICreateCourseRequest,
  FAQ,
  ModuleResponse,
  ReviewFAQsResponse,
  RelatedCourse,
  ICreateReviewRequest,
  ILessonNote,
} from "@/api/types/course.type";
import api from "@/api/api";

export const courseAPI = {
  getCourses: async (filters?: CourseFilters): Promise<CoursesResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((item) => params.append(key, item.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const { data } = await api.get(`/courses?${params.toString()}`);
    return data;
  },

  getCourseById: async (id: string): Promise<any> => {
    const { data } = await api.get(`/courses/${id}`);
    return data;
  },

  getCourseByUser: async (id: string): Promise<any> => {
    const { data } = await api.get(`/courses/${id}`);
    return data;
  },

  getCourseBySlug: async (slug: string): Promise<CourseDetail> => {
    const { data } = await api.get(`/courses/${slug}`);
    return data;
  },

  getCoursesCMS: async (filters?: CourseFilters): Promise<CoursesResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((item) => params.append(key, item.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const { data } = await api.get(`/cms/courses?${params.toString()}`);
    return data;
  },

  getCourseCMSBySlug: async (slug: string): Promise<CourseDetail> => {
    const { data } = await api.get(`/cms/courses/${slug}`);
    return data;
  },

  getRelatedCourses: async (courseId: string): Promise<{data: RelatedCourse[]}> => {
    const { data } = await api.get(`/courses/${courseId}/related`);
    return data;
  },

  getFAQs: async (courseId: string): Promise<FAQ[]> => {
    const { data } = await api.get(`/cms/courses/${courseId}/faqs`);
    return data;
  },

  getFAQsUser: async (courseId: string): Promise<FAQ[]> => {
    const { data } = await api.get(`/courses/${courseId}/faqs`);
    return data;
  },

  getModule: async (courseId: string): Promise<ModuleResponse> => {
    const { data } = await api.get(`/courses/${courseId}/modules`);
    return data;
  },

  getNote: async (courseId: string, lessonId: string): Promise<ILessonNote[]> => {
    const { data } = await api.get(`/courses/${courseId}/lessons/videos/${lessonId}/notes`);
    return data;
  },

  createNote: async (courseId: string, lessonId: string, noteData: { timestampSec: number; content: string }): Promise<any> => {
    const { data } = await api.post(`/courses/${courseId}/lessons/videos/${lessonId}/notes`, noteData);
    return data;
  },

  updateNote: async (courseId: string, lessonId: string, noteId: string, noteData: { content: string }): Promise<any> => {
    const { data } = await api.patch(`/courses/${courseId}/lessons/videos/${lessonId}/notes/${noteId}`, noteData);
    return data;
  },

  deleteNote: async (courseId: string, lessonId: string, noteId: string): Promise<any> => {
    const { data } = await api.delete(`/courses/${courseId}/lessons/videos/${lessonId}/notes/${noteId}`);
    return data;
  },

  getModuleForUser: async (courseId: string): Promise<ModuleResponse> => {
    const { data } = await api.get(`/courses/${courseId}/modules/user`);
    return data;
  },

  getModuleDetail: async (courseId: string, moduleId: string): Promise<ModuleResponse> => {
    const { data } = await api.get(`/courses/${courseId}/modules/${moduleId}`);
    return data;
  },

  getReview: async (courseId: string): Promise<ReviewFAQsResponse> => {
    const { data } = await api.get(`/products/${courseId}/reviews`);
    return data;
  },

  getReviewSummary: async (courseId: string): Promise<ReviewFAQsResponse> => {
    const { data } = await api.get(`/products/${courseId}/reviews/summary`);
    return data;
  },

  createReview: async (dataReview: ICreateReviewRequest): Promise<any> => {
    const { data } = await api.post(`/products/${dataReview.productId}/reviews`, dataReview.data);
    return data;
  },

  createCourse: async (courseData: ICreateCourseRequest): Promise<any> => {
    const { data } = await api.post("/cms/courses", courseData);
    return data;
  },

  updateCourse: async (courseData: ICreateCourseRequest, id: string): Promise<any> => {
    const { data } = await api.patch(`/cms/courses/${id}/metadata`, courseData);
    return data;
  },

  archiveCourse: async (id: string): Promise<any> => {
    const { data } = await api.post(`/cms/courses/${id}/archive`);
    return data;
  },

  draftCourse: async (id: string): Promise<any> => {
    const { data } = await api.post(`/cms/courses/${id}/draft`);
    return data;
  },

  publishCourse: async (id: string): Promise<any> => {
    const { data } = await api.post(`/cms/courses/${id}/publish`);
    return data;
  },

  getModules: async (courseId: string): Promise<any> => {
    const { data } = await api.get(`/cms/courses/${courseId}/modules`);
    return data;
  },

  createModule: async (courseId: string, moduleData: any): Promise<any> => {
    const { data } = await api.post(
      `/cms/courses/${courseId}/modules`,
      moduleData,
    );
    return data;
  },

  updateModule: async (courseId: string, moduleId: string, moduleData: any): Promise<any> => {
    const { data } = await api.patch(
      `/cms/courses/${courseId}/modules/${moduleId}`,
      moduleData,
    );
    return data;
  },

  reorderModules: async (courseId: string, reorderData: any): Promise<any> => {
    const { data } = await api.patch(
      `/cms/courses/${courseId}/modules/reorder`,
      reorderData,
    );
    return data;
  },

  // LESSONS API

  getLesson: async (courseId: string, moduleId: string): Promise<any> => {
    const { data } = await api.get(`/courses/${courseId}/modules/${moduleId}/lessons`);
    return data;
  },

  getLessonById: async (courseId: string, moduleId: string, lessonId: string): Promise<any> => {
    const { data } = await api.get(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
    return data;
  },

  createLessonArticle: async (courseId: string, moduleId: string, data: any): Promise<any> => {
    const { data: res } = await api.post(`/cms/courses/${courseId}/modules/${moduleId}/lessons/articles`, data);
    return res;
  },
  updateLessonArticle: async (courseId: string, moduleId: string, lessonId: string, data: any): Promise<any> => {
    const { data: res } = await api.patch(`/cms/courses/${courseId}/modules/${moduleId}/lessons/articles/${lessonId}`, data);
    return res;
  },
  createLessonVideo: async (courseId: string, moduleId: string, data: any): Promise<any> => {
    const { data: res } = await api.post(`/cms/courses/${courseId}/modules/${moduleId}/lessons/videos`, data);
    return res;
  },
  updateLessonVideo: async (courseId: string, moduleId: string, lessonId: string, data: any): Promise<any> => {
    const { data: res } = await api.patch(`/cms/courses/${courseId}/modules/${moduleId}/lessons/videos/${lessonId}`, data);
    return res;
  },

  // QUIZZES API
  createLessonQuiz: async (courseId: string, moduleId: string, data: any): Promise<any> => {
    const { data: res } = await api.post(`/cms/courses/${courseId}/modules/${moduleId}/lessons/quizzes`, data);
    return res;
  },
  updateLessonQuiz: async (courseId: string, moduleId: string, lessonId: string, data: any): Promise<any> => {
    const { data: res } = await api.patch(`/cms/courses/${courseId}/modules/${moduleId}/lessons/quizzes/${lessonId}`, data);
    return res;
  },

  // PRACTICES API
  createLessonPractice: async (courseId: string, moduleId: string, data: any): Promise<any> => {
    const { data: res } = await api.post(`/cms/courses/${courseId}/modules/${moduleId}/lessons/practices`, data);
    return res;
  },
  updateLessonPractice: async (courseId: string, moduleId: string, lessonId: string, data: any): Promise<any> => {
    const { data: res } = await api.patch(`/cms/courses/${courseId}/modules/${moduleId}/lessons/practices/${lessonId}`, data);
    return res;
  },

  // LESSON STATUS API
  publishLesson: async (courseId: string, moduleId: string, lessonId: string): Promise<any> => {
    const { data: res } = await api.post(`/cms/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/publish`);
    return res;
  },
  draftLesson: async (courseId: string, moduleId: string, lessonId: string): Promise<any> => {
    const { data: res } = await api.post(`/cms/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/draft`);
    return res;
  },
  archiveLesson: async (courseId: string, moduleId: string, lessonId: string): Promise<any> => {
    const { data: res } = await api.post(`/cms/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/archive`);
    return res;
  },

  // QUIZ QUESTION API
  createQuizQuestion: async (
    courseId: string,
    moduleId: string,
    lessonId: string,
    data: any,
  ): Promise<any> => {
    const { data: res } = await api.post(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questions`,
      data,
    );
    return res;
  },
  updateQuizQuestion: async (
    courseId: string,
    moduleId: string,
    lessonId: string,
    questionId: string,
    data: any,
  ): Promise<any> => {
    const { data: res } = await api.patch(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}`,
      data,
    );
    return res;
  },
  publishQuizQuestion: async (
    courseId: string,
    moduleId: string,
    lessonId: string,
    questionId: string,
  ): Promise<any> => {
    const { data: res } = await api.post(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}/publish`,
    );
    return res;
  },
  draftQuizQuestion: async (
    courseId: string,
    moduleId: string,
    lessonId: string,
    questionId: string,
  ): Promise<any> => {
    const { data: res } = await api.post(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}/draft`,
    );
    return res;
  },
  archiveQuizQuestion: async (
    courseId: string,
    moduleId: string,
    lessonId: string,
    questionId: string,
  ): Promise<any> => {
    const { data: res } = await api.post(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}/archive`,
    );
    return res;
  },

  // QUIZ OPTION API
  createQuizOption: async (
    courseId: string,
    moduleId: string,
    lessonId: string,
    questionId: string,
    data: any,
  ): Promise<any> => {
    const { data: res } = await api.post(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}/options`,
      data,
    );
    return res;
  },
  updateQuizOption: async (
    courseId: string,
    moduleId: string,
    lessonId: string,
    questionId: string,
    optionId: string,
    data: any,
  ): Promise<any> => {
    const { data: res } = await api.patch(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}/options/${optionId}`,
      data,
    );
    return res;
  },
  deleteQuizOption: async (
    courseId: string,
    moduleId: string,
    lessonId: string,
    questionId: string,
    optionId: string,
  ): Promise<any> => {
    const { data: res } = await api.delete(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/questions/${questionId}/options/${optionId}`,
    );
    return res;
  },

  // FAQ API
  createFAQ: async (courseId: string, data: any): Promise<any> => {
    const { data: res } = await api.post(`/cms/courses/${courseId}/faqs`, data);
    return res;
  },
  updateFAQ: async (
    courseId: string,
    faqId: string,
    data: any,
  ): Promise<any> => {
    const { data: res } = await api.patch(
      `/cms/courses/${courseId}/faqs/${faqId}`,
      data,
    );
    return res;
  },
  deleteFAQ: async (courseId: string, faqId: string): Promise<any> => {
    const { data: res } = await api.delete(
      `/cms/courses/${courseId}/faqs/${faqId}`,
    );
    return res;
  },
  publishFAQ: async (courseId: string, faqId: string): Promise<any> => {
    const { data: res } = await api.post(
      `/cms/courses/${courseId}/faqs/${faqId}/publish`,
    );
    return res;
  },
  draftFAQ: async (courseId: string, faqId: string): Promise<any> => {
    const { data: res } = await api.post(
      `/cms/courses/${courseId}/faqs/${faqId}/draft`,
    );
    return res;
  },

  // UPLOAD FILE API
  uploadFile: async (formData: FormData): Promise<any> => {
    const { data } = await api.post("/attachments/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  // UPLOAD MULTIPLE FILES API
  uploadMultipleFiles: async (formData: FormData): Promise<any> => {
    const { data } = await api.post("/attachments/upload-multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};
