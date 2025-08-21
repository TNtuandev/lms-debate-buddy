"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import CourseCard from "@/components/courses/course-card";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CourseTab } from "@/components/courses/course-tab";
import { useCourses } from "@/hooks/queries/course/useCourses";
import {
  CourseFilters,
  DifficultyLevel,
  SortOption,
} from "@/api/types/course.type";
import { useDebounce } from "@/hooks/useDebounce";

function CoursePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Nổi bật");
  const [filterOption, setFilterOption] = useState("Tất cả");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel[]>(
    [],
  );
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Check if search is pending (user is typing but debounced value hasn't updated)
  const isSearchPending = searchQuery !== debouncedSearchQuery;

  // Build filters for API
  const apiFilters: CourseFilters = useMemo(() => {
    const filters: CourseFilters = {
      page: currentPage,
    };

    if (debouncedSearchQuery.trim()) {
      filters.search = debouncedSearchQuery.trim();
    }

    if (difficultyFilter.length > 0) {
      filters.difficulty = difficultyFilter;
    }

    // Convert sort option to API format
    switch (sortOption) {
      case "Mới nhất":
        filters.sort_by = SortOption.NEWEST;
        break;
      case "Giá thấp đến cao":
        filters.sort_by = SortOption.PRICE_ASC;
        break;
      case "Giá cao đến thấp":
        filters.sort_by = SortOption.PRICE_DESC;
        break;
      case "Đánh giá cao nhất":
        filters.sort_by = SortOption.RATING_DESC;
        break;
      case "Đánh giá thấp nhất":
        filters.sort_by = SortOption.RATING_ASC;
        break;
      default:
        filters.sort_by = SortOption.POPULAR;
    }

    // Convert filter option to API format
    if (filterOption === "Miễn phí") {
      filters.price = "free";
    } else if (filterOption === "Trả phí") {
      filters.price = "paid";
    }

    return filters;
  }, [
    debouncedSearchQuery,
    sortOption,
    filterOption,
    difficultyFilter,
    currentPage,
  ]);

  // Fetch courses for the main filtered list
  const { data: coursesData, isLoading, error } = useCourses(apiFilters);

  // Fetch courses for CourseTab with label filter
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

  // Handle label change from CourseTab
  const handleLabelChange = (label: string | null) => {
    setSelectedLabel(label);
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdowns when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsFilterOpen(false);
      setIsSortOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, sortOption, filterOption, difficultyFilter]);

  // Function to handle course card click
  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  // Handle filter selection
  const handleFilterSelect = (filter: string) => {
    setFilterOption(filter);
    setIsFilterOpen(false);
  };

  // Handle sort selection
  const handleSortSelect = (sort: string) => {
    setSortOption(sort);
    setIsSortOpen(false);
  };

  return (
    <div>
      {/*header*/}
      <div className="bg-[linear-gradient(90deg,rgba(255,252,247,1)_0%,rgba(255,241,222,1)_30%,rgba(238,240,255,1)_100%)] h-[300px] w-full">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col md:flex-row items-center md:gap-8">
            <div className="text-5xl font-bold text-[#212B36]">
              Khóa học thiết kế
            </div>
            <div className="mt-2 md:mt-0 font-light text-[#001AC7] border bg-[#DBE0FF] border-white px-4 py-2 rounded-full">
              🎉 {coursesData?.data?.length || 0} Khóa học
            </div>
          </div>
          <p className="text-[#212B36] mt-2">
            Trang chủ {">"}{" "}
            <span className="text-gray-400">Khóa học thiết kế</span>
          </p>
        </div>
      </div>
      {/*course Start*/}
      <div className="bg-white w-full px-4 md:px-20 md:py-20 py-14">
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="text-3xl font-bold text-[#212B36]">
            Các khóa học giúp bạn bắt đầu
          </div>
          <div className="text-[#637381] mt-1">
            Khám phá các khóa học từ các chuyên gia giàu kinh nghiệm thực tế.
          </div>
          <CourseTab
            courses={courseTabData?.data || []}
            isLoading={isLoadingCourseTab}
            error={errorCourseTab}
            onCourseClick={handleCourseClick}
            onLabelChange={handleLabelChange}
            activeLabel={selectedLabel}
          />
        </div>
      </div>
      <div
        className="bg-[background: linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 232, 210, 0.15) 49.52%, rgba(205, 223, 255, 0.15) 100%);
] w-full px-4 md:px-20 md:py-20 py-14"
      >
        <div className="flex flex-col gap-4">
          <div className="text-3xl font-bold text-[#212B36]">
            Tất cả khóa học Thiết kế
          </div>
          <div className="text-sm text-gray-500 mb-2">
            {coursesData?.meta?.total || 0} kết quả được tìm thấy
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mt-2 w-full">
            {/* Search Box */}
            <div className="relative w-full sm:max-w-[320px]">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-2.5 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2F57EF] focus:border-[#2F57EF]"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              {/* Search pending indicator */}
              {isSearchPending && (
                <Loader2
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin"
                  size={16}
                />
              )}
              {/* Clear search button */}
              {searchQuery && !isSearchPending && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12 4L4 12M4 4l8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter and Sort */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Filter Dropdown */}
              <div className="relative w-1/2 sm:w-auto" ref={filterRef}>
                <button
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen);
                    setIsSortOpen(false);
                  }}
                  className="flex items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 w-full"
                >
                  <span>Lọc</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M8 10.6667L4 6.66675H12L8 10.6667Z"
                      fill="#637381"
                    />
                  </svg>
                </button>
                {isFilterOpen && (
                  <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1 bg-white shadow-lg rounded-lg py-2 w-full sm:w-48 z-20">
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleFilterSelect("Tất cả")}
                    >
                      Tất cả
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleFilterSelect("Miễn phí")}
                    >
                      Miễn phí
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleFilterSelect("Trả phí")}
                    >
                      Trả phí
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative w-1/2 sm:w-auto" ref={sortRef}>
                <button
                  onClick={() => {
                    setIsSortOpen(!isSortOpen);
                    setIsFilterOpen(false);
                  }}
                  className="flex items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 w-full whitespace-nowrap"
                >
                  <span className="truncate">Sắp xếp: {sortOption}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M8 10.6667L4 6.66675H12L8 10.6667Z"
                      fill="#637381"
                    />
                  </svg>
                </button>
                {isSortOpen && (
                  <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1 bg-white shadow-lg rounded-lg py-2 w-full sm:w-52 z-20">
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSortSelect("Nổi bật")}
                    >
                      Nổi bật
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSortSelect("Mới nhất")}
                    >
                      Mới nhất
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSortSelect("Giá thấp đến cao")}
                    >
                      Giá thấp đến cao
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSortSelect("Giá cao đến thấp")}
                    >
                      Giá cao đến thấp
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSortSelect("Đánh giá cao nhất")}
                    >
                      Đánh giá cao nhất
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSortSelect("Đánh giá thấp nhất")}
                    >
                      Đánh giá thấp nhất
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center col-span-full py-20">
              <Loader2 className="animate-spin text-gray-400" size={48} />
              <span className="ml-2 text-gray-500">Đang tải khóa học...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center col-span-full py-20">
              <div className="text-center">
                <p className="text-red-500 mb-2">
                  Có lỗi xảy ra khi tải dữ liệu
                </p>
                <p className="text-gray-500 text-sm">
                  {error?.message || "Vui lòng thử lại sau"}
                </p>
              </div>
            </div>
          )}

          {/* Course Grid */}
          {!isLoading && !error && (
            <div className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 flex flex-col mt-4">
              {coursesData?.data?.length ? (
                coursesData.data.map((course) => (
                  <div
                    key={course.id}
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() => handleCourseClick(course.slug)}
                  >
                    <CourseCard
                      slug={course.slug}
                      gridNUmber={4}
                      title={course.title}
                      imageUrl={course.thumbnail}
                      category="Khóa học"
                      courseName={course.title}
                      instructor={`Giảng viên: ${course?.owner.fullName}`}
                      lessonCount={course.totalLesson}
                      badge={course.label}
                      studentCount={course.enrollmentCnt}
                      currentPrice={
                        course.pricing.discounted
                          ? course.pricing.discounted.toLocaleString()
                          : course.pricing.regular.toLocaleString()
                      }
                      originalPrice={
                        course.pricing.discounted
                          ? course.pricing.regular.toLocaleString()
                          : ""
                      }
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-500">Không tìm thấy khóa học nào</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading &&
            !error &&
            coursesData?.meta &&
            coursesData.meta.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Trước
                  </button>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: Math.min(5, coursesData.meta.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 border border-gray-200 rounded-lg ${
                            page === currentPage
                              ? "bg-[#2F57EF] text-white"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(coursesData.meta.totalPages, prev + 1),
                      )
                    }
                    disabled={currentPage === coursesData.meta.totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
