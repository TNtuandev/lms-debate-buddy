"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Add, Edit, HambergerMenu, ImportCurve, Trash } from "iconsax-react";
import { ChevronDown, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import AddChapterModal from "./modal/AddChapterModal";
import { CreateLessonModal } from "@/app/(admin)/create-courses/create/components/modal/CreateLessonModal";
import { CreateQuizModal } from "@/app/(admin)/create-courses/create/components/modal/CreateQuizModal";
import { UploadCodeAssignment } from "./modal/CreateAssignment/UploadCodeAssignment";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";
import { IModule, useModules } from "@/hooks/queries/course/useModuleCourse";
import {usePublishLesson} from "@/hooks/queries/course/useLessonCourse";

export default function CourseBuilderSection() {
  const [isExpandedChapters, setIsExpandedChapters] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenModalCreateLesson, setIsOpenModalCreateLesson] = useState(false);
  const [isOpenModalCreateQuiz, setIsOpenModalCreateQuiz] = useState(false);
  const [isOpenModalCreateAssignmentCode, setIsOpenModalCreateAssignmentCode] =
    useState(false);
  const [chapters, setChapters] = useState<IModule[]>([]);
  const { courseData, setModuleSelected, setLessonSelected } =
    useCreateCourseContext();
  const [publishLessonParams, setPublishLessonParams] = useState<{courseId: string, moduleId: string, lessonId: string} | null>(null);
  const publishLessonMutation = usePublishLesson(
    publishLessonParams?.courseId || "",
    publishLessonParams?.moduleId || "",
    publishLessonParams?.lessonId || "",
    () => {
      refetchChapters();
      setPublishLessonParams(null);
    }
  );

  const { data: initialChapters, refetch: refetchChapters } = useModules(
    courseData?.id as string,
  );


  useEffect(() => {
    if (initialChapters) {
      setChapters((prevState) => {
        // If prevState is empty, initialize with initialChapters
        return initialChapters.data.map((c) => {
          const findNodeModuleConfig = prevState.find((item) => item.id === c.id);
          return {
            id: c.id,
            title: c.title,
            shortDescription: c.shortDescription,
            isExpanded: findNodeModuleConfig?.isExpanded ?? false,
            lessons: c.lessons,
          }
        });
      });
    }
  }, [initialChapters]);

  useEffect(() => {
    if (
      publishLessonParams &&
      publishLessonParams.courseId &&
      publishLessonParams.moduleId &&
      publishLessonParams.lessonId
    ) {
      publishLessonMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishLessonParams]);

  const toggleChapter = (chapterId: string) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isExpanded: !chapter.isExpanded }
          : chapter,
      ),
    );
  };

  const handlePublishLesson = (chapter: IModule, lesson: any) => {
    if (!courseData?.id || !chapter?.id || !lesson?.id) return;
    setPublishLessonParams({
      courseId: courseData.id,
      moduleId: chapter.id,
      lessonId: lesson.id,
    });
  };

  const deleteChapter = (chapterId: string) => {
    setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
  };

  const handleEditModule = (module: IModule) => {
    setModuleSelected(module);
    setIsModalOpen(true);
  };

  const handleEditLesson = (module: IModule, lesson: any) => {
    setLessonSelected(lesson);
    setModuleSelected(module);
    switch (lesson.type) {
      case "VIDEO":
      case "ARTICLE":
        setIsOpenModalCreateLesson(true);
        break;
      case "QUIZ":
        setIsOpenModalCreateQuiz(true);
        break;
      case "PRACTICE":
        setIsOpenModalCreateAssignmentCode(true);
        break;
    }
  };

  const handleRefetch = () => {
    refetchChapters();
  };

  // const handleSubmitCreateQuiz = (data: any) => {
  //   console.log("Submitted quiz data:", data);
  // }

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <div
        className="flex items-center justify-between p-4 cursor-pointer transition-colors"
        onClick={() => setIsExpandedChapters(!isExpandedChapters)}
      >
        <h3 className="text-base font-medium text-primary-contrastText">
          Xây dựng khóa học
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            isExpandedChapters ? "rotate-180" : ""
          }`}
        />
      </div>

      {isExpandedChapters && (
        <div className="p-4 space-y-3">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="bg-white rounded-lg">
              <div
                className="flex items-center justify-between p-3 cursor-pointer bg-gray-50 rounded-t-lg"
                onClick={() => toggleChapter(chapter.id)}
              >
                <h4 className="text-xl font-medium text-primary-contrastText">
                  {chapter.title}
                </h4>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditModule(chapter)}
                    className="h-8 w-8"
                  >
                    <Edit size={16} color="#637381" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChapter(chapter.id);
                    }}
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <Trash size={16} color="#637381" />
                  </Button>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      chapter.isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {chapter.isExpanded && (
                <div className="p-4 space-y-3">
                  {chapter?.lessons &&
                    chapter?.lessons?.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 border border-[#919EAB52] rounded-md bg-white hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <HambergerMenu
                            size={24}
                            color="#637381"
                            className="h-5 w-5 text-gray-400 mr-3 cursor-move"
                          />
                          <p className="text-sm font-medium">{lesson.title}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            type="button"
                            onClick={() => {
                              handleEditLesson(chapter, lesson);
                            }}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit
                              size={16}
                              color="#637381"
                              className="h-4 w-4"
                            />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              handlePublishLesson(chapter, lesson);
                            }}
                          >
                            <Upload
                              size={16}
                              color={lesson?.status === "PUBLISHED" ? "#2F57EF" : "#637381"}
                              className="h-4 w-4"
                            />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash
                              size={16}
                              color="#637381"
                              className="h-4 w-4"
                            />
                          </Button>
                        </div>
                      </div>
                    ))}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => {
                          setIsOpenModalCreateLesson(true);
                          setModuleSelected(chapter);
                          setLessonSelected(null);
                        }}
                        className="border-primary-main/48"
                        type="button"
                        variant="outline"
                        size="sm"
                      >
                        <Add
                          size={20}
                          color="#2F57EF"
                          className="w-4 h-4 mr-1"
                        />
                        Bài học
                      </Button>
                      <Button
                        onClick={() => {
                          setIsOpenModalCreateQuiz(true);
                          setModuleSelected(chapter);
                          setLessonSelected(null);
                        }}
                        className="border-primary-main/48"
                        type="button"
                        variant="outline"
                        size="sm"
                      >
                        <Add
                          size={20}
                          color="#2F57EF"
                          className="w-4 h-4 mr-1"
                        />
                        Bài kiểm tra
                      </Button>
                      <Button
                        onClick={() => {
                          setIsOpenModalCreateAssignmentCode(true);
                          setModuleSelected(chapter);
                          setLessonSelected(null);
                        }}
                        className="border-primary-main/48"
                        type="button"
                        variant="outline"
                        size="sm"
                      >
                        <Add
                          size={20}
                          color="#2F57EF"
                          className="w-4 h-4 mr-1"
                        />
                        Bài tập
                      </Button>
                    </div>
                    <Button
                      className="border-primary-main/48"
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <ImportCurve
                        size={20}
                        color="#2F57EF"
                        className="w-4 h-4 mr-2"
                      />
                      Nhập bài kiểm tra
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsModalOpen(true);
                setModuleSelected(undefined);
              }}
              className="w-full h-11 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg"
            >
              <Add size={30} color="#212B36" className="w-4 h-4 mr-0.5" />
              Thêm chủ đề mới
            </Button>
          </div>
        </div>
      )}
      <UploadCodeAssignment
        isOpen={isOpenModalCreateAssignmentCode}
        onClose={() => {
          setModuleSelected(undefined);
          setIsOpenModalCreateAssignmentCode(false);
        }}
        onSubmit={handleRefetch}
      />
      <CreateLessonModal
        isOpen={isOpenModalCreateLesson}
        onClose={() => {
          setIsOpenModalCreateLesson(false);
          setModuleSelected(undefined);
        }}
        onSubmit={handleRefetch}
      />
      <AddChapterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddChapter={handleRefetch}
      />
      <CreateQuizModal
        isOpen={isOpenModalCreateQuiz}
        onSubmit={handleRefetch}
        onClose={() => setIsOpenModalCreateQuiz(false)}
      />
    </Card>
  );
}
