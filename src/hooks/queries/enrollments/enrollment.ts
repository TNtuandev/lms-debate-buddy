export interface Enrollment {
  createdAt: string
  updatedAt: string
  deletedAt: any
  id: string
  userId: string
  productId: string
  expiresAt: any
  user: User
  course: Course
}

export interface User {
  createdAt: string
  updatedAt: string
  deletedAt: any
  id: string
  type: string
  email: string
  username: any
  passwordHash: string
  isEmailVerified: boolean
  fullName: string
  firstName: string
  lastName: string
  skill: string
  bio: string
  phoneNumber: any
  avatarUrl: string
  coverPhotoUrl: any
  status: string
}

export interface Course {
  id: string
  category: Category
  owner: Owner
  title: string
  slug: string
  shortDescription: string
  description: string
  thumbnail: string
  label: string
  status: string
  ratingAvg: number
  ratingCnt: number
  enrollmentCnt: number
  regularPrice: number
  discountedPrice: number
  requirements: string
  learningOutcomes: string
  previewVideo: string
  previewImg: string
  difficulty: string
  maxEnrollment: number
  tags: any
  isAllowFaq: boolean
  isDripContent: boolean
  overview: any[]
  language: any
  certification: any
  totalCompletedLessons: number
  totalLessons: number
  duration: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  title: string
  slug: string
}

export interface Owner {
  id: string
  email: string
  fullName: string
}
