"use client";

import React from "react";
import IconLessonVideo from "../../../public/icons/lessson/IconLessonVideo";
import IconLessonDoc from "../../../public/icons/lessson/IconLessonDoc";
import IconLessonQuiz from "../../../public/icons/lessson/IconLessonQuiz";
import IconLessonVideoActive from "../../../public/icons/lessson/IconLessonVideoActive";
import IconLessonDocActive from "../../../public/icons/lessson/IconLessonDocActive";
import IconLessonQuizActive from "../../../public/icons/lessson/IconLessonQuizActive";
import IconLessonExerciseActive from "../../../public/icons/lessson/IconLessonExerciseActive";
import IconLessonExercise from "../../../public/icons/lessson/IconLessonExercise";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: string;
  active?: boolean;
  isCompleted?: boolean;
}

interface Section {
  id: string;
  title: string;
  expanded: boolean;
  lessons: Lesson[];
  progress?: string;
}

interface LessonSidebarProps {
  sections: Section[];
  onToggleSection: (sectionId: string) => void;
  onSelectLesson: (lesson: Lesson) => void;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({
  sections,
  onToggleSection,
  onSelectLesson,
}) => {
  const renderIconLessonType = (type: string, active: boolean) => {
    switch (type) {
      case "video":
        return active ? <IconLessonVideoActive /> : <IconLessonVideo />;
      case "doc":
        return active ? <IconLessonDocActive /> : <IconLessonDoc />;
      case "quiz":
        return active ? <IconLessonQuizActive /> : <IconLessonQuiz />;
      case "exercise":
        return active ? <IconLessonExerciseActive /> : <IconLessonExercise />
      default:
        return null;
    }
  }

  console.log(sections);

  return (
    <div className="w-[350px] bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-2.5">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          {sections.map((section) => (
            <div
              key={section.id}
              className="border border-gray-100 rounded-lg overflow-hidden"
            >
              <div
                className={`flex justify-between items-center p-3 cursor-pointer ${
                  section.expanded ? "bg-blue-50" : "bg-white"
                }`}
                onClick={() => onToggleSection(section.id)}
              >
                <div className="flex items-center">
                  <span className="text-sm font-semibold">
                    {section.title}
                  </span>
                  {section.progress && (
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {section.progress}
                    </span>
                  )}
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    section.expanded ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {section.expanded && (
                <div className="bg-white">
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`flex p-3 border-t border-gray-100 cursor-pointer ${
                        lesson.active ? "bg-blue-50" : ""
                      }`}
                      onClick={() => onSelectLesson(lesson)}
                    >
                      <div className="flex flex-1 justify-between">
                        <div className="flex gap-2">
                          <div className="flex items-center gap-2">
                            {renderIconLessonType(
                              lesson.type,
                              lesson.active || false,
                            )}
                          </div>
                          <p className={`text-sm ${lesson.active ? "text-[#2F57EF]" : ""}`}>
                            {lesson.title}
                          </p>
                        </div>

                        <div className="mr-3 flex-shrink-0">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer ${
                              lesson?.isCompleted
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300"
                            }`}
                          >
                            {lesson?.isCompleted && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="white"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonSidebar;
