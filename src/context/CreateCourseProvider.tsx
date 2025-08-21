"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { CourseDetail } from "@/api/types/course.type";
import { IModule } from "@/hooks/queries/course/useModuleCourse";

// ✅ Define AuthContext Interface
interface CreateCourseContextType {
  courseData?: CourseDetail;
  setCourseData: (course?: CourseDetail) => void;
  moduleSelected?: IModule;
  setModuleSelected: (module?: IModule) => void;
  lessonSelected?: any; // Adjust type as needed
  setLessonSelected: (lesson?: any) => void; // Adjust type as needed
}

// ✅ Create Context
const CreateCourseContext = createContext<CreateCourseContextType | null>(null);

// ✅ Custom Hook to Access Context
export const useCreateCourseContext = () => {
  const context = useContext(CreateCourseContext);
  if (!context) {
    throw new Error(
      "CreateCourseContext must be used within an CreateCourseProvider",
    );
  }
  return context;
};

// ✅ AuthProvider Component
export function CreateCourseProvider({ children }: { children: ReactNode }) {
  const [courseData, setCourseData] = useState<CourseDetail>();

  const [moduleSelected, setModuleSelected] = useState<IModule>();
  const [lessonSelected, setLessonSelected] = useState<any>();

  return (
    <CreateCourseContext.Provider
      value={{
        courseData,
        setCourseData: (c?: CourseDetail) => {
          setCourseData(c as any);
        },
        moduleSelected,
        setModuleSelected: (m?: IModule) => {
          setModuleSelected(m);
        },
        lessonSelected, // Initialize as needed
        setLessonSelected: (l?: any) => {
          // Adjust type as needed
          setLessonSelected(l)
        },
      }}
    >
      {children}
    </CreateCourseContext.Provider>
  );
}
