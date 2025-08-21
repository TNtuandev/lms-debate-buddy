export interface IntructorResponsive {
  data: {
    auditInfo: {
      createdAt: string;
      deletedAt: string;
      updatedAt: string;
    };
    bio: string;
    cvUrl: string;
    expertise: string;
    isVerified: boolean;
    ratingAverage: string;
    totalReviews: string;
    userId: string;
  };
}
interface AuditInfo {
  _createdAt: string;
  _updatedAt: string;
  _deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LearnerProfile {
  data: {
    _id: string;
    _userId: string;
    _bio: string | null;
    _dateOfBirth: string | null;
    _educationLevel: string | null;
    _interests: string | null;
    _gender: "male" | "female" | "other"; // assuming possible values
    _totalCoursesEnrolled: number;
    _totalCoursesInProgress: number;
    _totalCoursesCompleted: number;
    _auditInfo: AuditInfo;
    _mobilePhone: string;
  };
}

export interface InstructorProfile {
  data: {
    id: string
    userId: string
    bio: string
    cvUrl: string
    expertise: string
    ratingAverage: string
    totalReviews: number
    totalStudents: number
    totalCourses: number
    isVerified: boolean
    auditInfo: AuditInfoInstructor

    totalPrices: number
    mobilePhone: string
  }
}

export interface AuditInfoInstructor {
  createdAt: string
  updatedAt: string
  deletedAt: any
}

