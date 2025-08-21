import {EStatusCourse} from "@/hooks/queries/course/useStatusCourse";

export interface CourseFilters {
  search?: string;
  category?: string[];
  difficulty?: DifficultyLevel[];
  label?: string[];
  price?: string;
  rating_min?: number;
  sort_by?: SortOption;
  page?: number;
  limit?: number;
  include_draft?: boolean;
  include_archived?: boolean;
  owner_id?: string;
  status?: EStatusCourse;
  perPage?: number
}

export enum DifficultyLevel {
  ALL = "ALL",
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED"
}

export enum SortOption {
  NEWEST = "newest",
  RATING_DESC = "rating_desc", 
  RATING_ASC = "rating_asc",
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
  POPULAR = "popular"
}

export enum CourseLabel {
  NEW = "NEW",
  HOT = "HOT",
  BEST_SELLER = "BEST_SELLER",
  FEATURED = "FEATURED",
  NONE = "NONE"
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: string;
  difficulty: string;
  label?: string;
  totalLesson: number;
  owner: {
    id: string;
    email: string;
    fullName: string;
  }
  pricing: {
    regular: number;
    discounted?: number;
  };
  rating: {
    avg: number;
    count: number;
  };
  enrollmentCnt: number;
  status: EStatusCourse;
  discountedPrice: number,
  regularPrice: number
}

export interface CourseDetail {
  
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  type: string;
  thumbnail: string;
  label: string;
  status: string;
  regularPrice: number;
  discountedPrice?: number;
  ratingAvg: number;
  ratingCnt: number;
  enrollmentCnt: number;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  owner: {
    id: string;
    email: string;
    fullName: string;
  };
  previewImg: string;
  learningOutcomes: string;
  previewVideo: string;
  requirements: string;
  createdAt: string;
  updatedAt: string;
  totalLessons: number;
  duration: number;
  overview: string[]
}

export interface CoursesResponse {
  data: Course[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface RelatedCourse {
  id: string;
  productId: string;
  relatedId: string;
  order: number;
  notes: string;
  relatedTo: {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    type: string;
    thumbnail: string;
    label: string;
    status: string;
    regularPrice: number;
    discountedPrice: number;
    ratingAvg: number;
    ratingCnt: number;
    enrollmentCnt: number;
    category: {
      id: string;
      title: string;
      slug: string;
    };
    owner: {
      id: string;
      email: string;
      fullName: string;
    };
    previewImg: string;
    learningOutcomes: string;
    previewVideo: string;
    requirements: string;
    totalLessons: number;
    duration: number;
    createdAt: string;
    updatedAt: string;
  };
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    type: string;
    thumbnail: string;
    label: string;
    status: string;
    regularPrice: number;
    discountedPrice: number;
    ratingAvg: number;
    ratingCnt: number;
    enrollmentCnt: number;
    category: {
      id: string;
      title: string;
      slug: string;
    };
    owner: {
      id: string;
      email: string;
      fullName: string;
    };
    previewImg: string;
    learningOutcomes: string;
    previewVideo: string;
    requirements: string;
    totalLessons: number;
    duration: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface RelatedCoursesResponse {
  data: RelatedCourse[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: string;
  status: string;
  productId: string;
  isExpanded?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ReviewFAQsResponse {
  data: Review[];
}

export interface FAQsResponse {
  data: FAQ[];
}

interface LessonModule {
  id: string;
  moduleId: string;
  title: string;
  shortDescription: string;
  order: number;
  type: 'ARTICLE' | 'VIDEO' | 'QUIZ' | string; // Extend types as needed
  duration: number; // in minutes
  isPreviewable: boolean;
  description: string;
  thumbnail: string | null;
  attachment: string | null;
}

interface Module {
  id: string;
  title: string;
  shortDescription: string;
  order: number;
  lessons: LessonModule[];
}

export interface ModuleResponse {
  data: Module[];
}

export interface ILessonNote {
  id: string;
  lessonId: string;
  userId: string;
  timestampSec: number;
  content: string;
  createdAt: string; // or Date if you parse it later
  updatedAt: string; // or Date if you parse it later
}

export interface ICreateCourseRequest {
  title: string
  slug?: string
  shortDescription: string
  description: string
  thumbnail: string
  label?: string
  categoryId: string
  requirements: string
  learningOutcomes: string
  previewVideo: string
  previewImg: string
  difficulty: string
  regularPrice: number
  discountedPrice?: number
}

export interface ICreateReviewRequest {
  data: {
    rating: number;
    content: string;
    title: string;
  };
  productId: string
}
