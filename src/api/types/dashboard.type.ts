export interface ILessonAttempt {
  id: string;
  userId: string;
  lessonId: string;
  score: number;
  startedAt: string; // ISO date string, e.g., "2025-07-22T15:20:31.258Z"
  attemptAt: string; // ISO date string
  isPassed: boolean;
  passedAt: string; // ISO date string
  totalAnswer: number;
  courseTitle: string;
  correctAnswer: number;
}

export interface ILessonAttemptResponsive {
  data: ILessonAttempt[]
}

export interface ILessonSubmission {
  id: string;
  userId: string;
  lessonId: string;
  submittedAt: string; // ISO date string, e.g., "2025-07-15T10:20:40.930Z"
  isPassed: boolean;
  passedAt: string | null; // null nếu chưa qua bài
  score: number;
  lessonName: string;
  courseName: string;
}

export interface ILessonSubmissionResponsive {
  data: ILessonSubmission[]
}

export interface CourseWishList {
  id: string;
  regularPrice: number;
  discountedPrice: number;
  requirements: string;
  learningOutcomes: string;
  previewVideo: string;
  previewImg: string;
  difficulty: 'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  maxEnrollment: number;
  tags: string[] | null;
  isAllowFaq: boolean;
  isDripContent: boolean;
  overview: string[] | null;
  language: string | null;
  certification: string | null;
  totalCompletedLessons: number;
}

export interface ProductWishList {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  type: string; // or 'COURSE'
  categoryId: string;
  ownerId: string;
  thumbnail: string;
  label: string; // e.g. "NEW", "FEATURED"
  status: string; // e.g. "PUBLISHED"
  ratingAvg: number;
  ratingCnt: number;
  enrollmentCnt: number;
  course: CourseWishList;
}

export interface EnrollmentCourseWishList {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  userId: string;
  productId: string;
  product: ProductWishList;
}

export interface IEnrollmentCourseWishListResponsive {
  data: EnrollmentCourseWishList[]
}
