"use client";

import { CreateCourseProvider } from "@/context/CreateCourseProvider";
import CreateCourse from "@/app/(admin)/create-courses/CreateCourse";
import { Suspense } from "react";

const CreateCoursePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateCourseProvider>
        <CreateCourse />
      </CreateCourseProvider>
    </Suspense>
  );
};

export default CreateCoursePage;
