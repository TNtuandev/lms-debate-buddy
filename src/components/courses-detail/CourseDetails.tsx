import React, { useState, useRef, useEffect } from "react";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";

interface CourseDetailsProps {
  courseDetail: {
    requirements?: string;
    description: string;
    learningOutcomes?: string;
  };
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({ courseDetail }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        // Create a temporary element to measure full height
        const tempElement = element.cloneNode(true) as HTMLDivElement;
        tempElement.style.position = 'absolute';
        tempElement.style.visibility = 'hidden';
        tempElement.style.height = 'auto';
        tempElement.style.maxHeight = 'none';
        tempElement.classList.remove('line-clamp-3');
        
        document.body.appendChild(tempElement);
        const fullHeight = tempElement.scrollHeight;
        document.body.removeChild(tempElement);
        
        // Check if content is overflowing when clamped
        const clampedHeight = element.scrollHeight;
        setIsOverflowing(fullHeight > clampedHeight);
      }
    };

    checkOverflow();
    // Re-check on window resize
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [courseDetail.description, courseDetail.learningOutcomes]);

  return (
    <>
      {/* Requirements Section */}
      <div className="bg-white p-6 rounded-lg border shadow border-gray-100 mb-8">
        <h3 className="text-xl font-bold mb-6">Yêu cầu</h3>
        <div className="space-y-2">
          <div>
            &#8226;{" "}
            {courseDetail.requirements || "Không có yêu cầu đặc biệt"}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white p-6 rounded-lg border shadow border-gray-100 mb-8">
        <h3 className="text-xl font-bold mb-6">Mô tả</h3>
        <div
          ref={contentRef}
          className={`space-y-4 ${!showFullDesc ? "line-clamp-3" : ""}`}
        >
          <p>{courseDetail.description}</p>
          {courseDetail.learningOutcomes && (
            <div>
              <h4 className="font-semibold mb-2">Kết quả học tập:</h4>
              <p>{courseDetail.learningOutcomes}</p>
            </div>
          )}
        </div>
        {isOverflowing && (
          <button
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="text-[#2F57EF] flex items-center gap-2 mt-4 font-medium"
          >
            {showFullDesc ? "Ẩn bớt" : "Hiển thị thêm"}
            {!showFullDesc ? (
              <ArrowDown2 size="20" color="#2F57EF" />
            ) : (
              <ArrowUp2 size="20" color="#2F57EF" />
            )}
          </button>
        )}
      </div>
    </>
  );
}; 