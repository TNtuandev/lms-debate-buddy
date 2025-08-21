"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Add, Edit, HambergerMenu, Trash } from "iconsax-react";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";
import { useFAQs } from "@/hooks/queries/course/useFaqs";
import { FAQ } from "@/api/types/course.type";
import { FaqModal } from "@/app/(admin)/create-courses/create/components/modal/FaqModal";

export default function CourseFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isOpenFaqModal, setIsOpenFaqModal] = useState(false);
  const { courseData } = useCreateCourseContext();

  const { data: initialFaqs, refetch: refetchFaqs } = useFAQs(
    courseData?.id as string,
  );

  // const deleteFaq = useDeleteFAQ()

  const handleSubmit = () => {
    refetchFaqs();
  };

  useEffect(() => {
    if (initialFaqs) {
      setFaqs(
        initialFaqs.map((faq) => ({
          ...faq,
          isExpanded: faq.isExpanded || false,
        })),
      );
    }
  }, [initialFaqs]);

  const toggleFaq = (faqId: string) => {
    setFaqs(
      faqs.map((faq) =>
        faq.id === faqId ? { ...faq, isExpanded: !faq.isExpanded } : faq,
      ),
    );
  };

  const addNewFaq = () => {
    setIsOpenFaqModal(true);
  };

  const deleteFaq = (faqId: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== faqId));
    // deleteFaq.mutate({ courseId: courseData?.id as string, faqId });
  };

  const editFaqQuestion = (faqId: string, newQuestion: string) => {
    setFaqs(
      faqs?.map((faq) =>
        faq.id === faqId ? { ...faq, question: newQuestion } : faq,
      ),
    );
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-4 cursor-pointer transition-colors">
        <h3 className="text-base font-medium text-primary-contrastText">FAQ</h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${"rotate-180"}`}
        />
      </div>

      <div className="p-4 space-y-3">
        {faqs?.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between p-3 cursor-pointer bg-gray-50 rounded-t-lg">
              <div
                className="flex items-center flex-grow"
                onClick={() => toggleFaq(faq.id)}
              >
                <HambergerMenu
                  size={24}
                  color="#637381"
                  className="h-5 w-5 text-gray-400 mr-3 cursor-move"
                />
                <h4 className="text-sm font-medium text-primary-contrastText">
                  {faq.question}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newQuestion = prompt(
                      "Nhập câu hỏi mới:",
                      faq.question,
                    );
                    if (newQuestion) editFaqQuestion(faq.id, newQuestion);
                  }}
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
                    deleteFaq(faq.id);
                  }}
                  className="h-8 w-8"
                >
                  <Trash size={16} color="#637381" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFaq(faq.id)}
                  className="h-8 w-8"
                >
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      faq.isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>

            {faq.isExpanded && (
              <div className="p-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}

        <div className="pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={addNewFaq}
            className="w-full h-11 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg"
          >
            <Add size={20} color="#212B36" className="w-4 h-4 mr-1" />
            Thêm câu hỏi mới
          </Button>
        </div>
      </div>
      <FaqModal
        isOpen={isOpenFaqModal}
        onClose={() => setIsOpenFaqModal(false)}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
