import {CourseLabel, DifficultyLevel} from "@/api/types/course.type";

export const DIFFICULTY_LEVEL = [
  {
    label: "Tất cả",
    value: DifficultyLevel.ALL,
  },
  {
    label: "Dễ",
    value: DifficultyLevel.BEGINNER,
  },
  {
    label: "Trung bình",
    value: DifficultyLevel.INTERMEDIATE,
  },
  {
    label: "Khó",
    value: DifficultyLevel.ADVANCED,
  },
]

export const COURSE_LABELS = [
  {
    label: "Mới",
    value: CourseLabel.NEW,
  },
  {
    label: "Hot",
    value: CourseLabel.HOT,
  },
  {
    label: "Bán chạy",
    value: CourseLabel.BEST_SELLER,
  },
  {
    label: "Nổi bật",
    value: CourseLabel.FEATURED,
  },
];