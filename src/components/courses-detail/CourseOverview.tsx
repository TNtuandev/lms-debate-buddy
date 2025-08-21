import React from "react";
import IconTickGreen from "../../../public/icons/IconTickGreen";

interface ICourseOverview {
  courseDetail: string[];
}

export const CourseOverview: React.FC<ICourseOverview> = ({courseDetail}) => {
  const defaultData = [
    "Thật nhiều kến thức mới và bổ ích",
  ];

  const learningPoints = courseDetail.length > 0 ? courseDetail : defaultData;

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mb-8">
      <h3 className="text-xl font-bold mb-6">
        Những gì bạn sẽ học được
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {learningPoints.map((point, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-shrink-0">
              <IconTickGreen />
            </div>
            <p>{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 