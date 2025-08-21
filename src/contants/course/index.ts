import { EStatusCourse } from "@/hooks/queries/course/useStatusCourse";

export const ListStatusCourse = [
  { label: "Công khai", value: EStatusCourse.PUBLISHED },
  { label: "Nháp", value: EStatusCourse.DRAFT },
  { label: "Lưu trữ", value: EStatusCourse.ARCHIVED },
];