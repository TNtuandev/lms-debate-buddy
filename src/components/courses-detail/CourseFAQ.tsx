import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface CourseFAQProps {
  faqsData?: FAQ[];
  isLoadingFAQs: boolean;
  errorFAQs?: Error | null;
}

export const CourseFAQ: React.FC<CourseFAQProps> = ({ 
  faqsData, 
  isLoadingFAQs, 
  errorFAQs 
}) => {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  return (
    <div className="bg-white p-6 rounded-lg border shadow border-gray-100 mb-8">
      <h3 className="text-xl font-bold mb-6">Câu hỏi thường gặp</h3>

      {isLoadingFAQs ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-gray-400" size={24} />
          <span className="ml-2 text-gray-500">
            Đang tải câu hỏi thường gặp...
          </span>
        </div>
      ) : errorFAQs ? (
        <div className="text-center py-10">
          <p className="text-red-500 mb-2">
            Có lỗi xảy ra khi tải câu hỏi thường gặp
          </p>
          <p className="text-gray-500 text-sm">
            {errorFAQs?.message || "Vui lòng thử lại sau"}
          </p>
        </div>
      ) : faqsData && faqsData?.length > 0 ? (
        <div className="space-y-3">
          {faqsData.map((faq) => (
            <div
              key={faq.id}
              role="presentation"
              className="cursor-pointer"
              onClick={() => {
                if (activeQuestion === faq.id) {
                  setActiveQuestion(null);
                  return;
                }
                setActiveQuestion(faq.id);
              }}
            >
              <div className="flex items-center flex-shink-0 justify-between bg-[#F4F6F8] px-3 py-2 rounded">
                <div
                  className={`font-semibold ${activeQuestion === faq.id ? "text-[#2F57EF]" : ""}`}
                >
                  {faq.question}
                </div>
                {activeQuestion === faq.id ? (
                  <ArrowUp2
                    size="16"
                    color="#212B36"
                    className="flex-shink-0"
                  />
                ) : (
                  <ArrowDown2
                    size="16"
                    color="#212B36"
                    className="flex-shink-0"
                  />
                )}
              </div>
              {activeQuestion === faq.id && (
                <div className="mt-2 text-primary px-2">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Chưa có câu hỏi thường gặp nào
          </p>
        </div>
      )}
    </div>
  );
}; 