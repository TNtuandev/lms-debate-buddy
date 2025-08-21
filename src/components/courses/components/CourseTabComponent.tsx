"use client";

import {CourseTab} from "@/components/courses/course-tab";
import React, { useMemo, useState } from "react";
import {useCourses} from "@/hooks/queries/course";
import { CourseFilters, SortOption } from "@/api/types/course.type";
import {useRouter} from "next/navigation";

export default function CourseTabComponent() {
  const router = useRouter();

  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const courseTabFilters: CourseFilters = useMemo(() => {
    const filters: CourseFilters = {
      sort_by: SortOption.POPULAR,
    };

    if (selectedLabel) {
      filters.label = [selectedLabel];
    }

    return filters;
  }, [selectedLabel]);
  const {
    data: courseTabData,
    isLoading: isLoadingCourseTab,
    error: errorCourseTab,
  } = useCourses(courseTabFilters);
  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const handleLabelChange = (label: string | null) => {
    setSelectedLabel(label);
  };
  return (
    <CourseTab
      courses={courseTabData?.data || []}
      isLoading={isLoadingCourseTab}
      error={errorCourseTab}
      onCourseClick={handleCourseClick}
      onLabelChange={handleLabelChange}
      activeLabel={selectedLabel}
    />
  )
}