import React from "react";
import { HeaderSection } from "@/components/common/HeaderSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS_LIST } from "@/contants/faqs";

function FaqPage() {
  return (
    <>
      <HeaderSection title="FAQS" label="Trang chủ" subLabel="FAQS" />
      <div className="py-12 lg:py-32 px-6 md:max-w-3xl max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto w-full flex flex-col items-center justify-center h-full">
        <div className="font-bold text-2xl leading-9 lg:text-3xl lg:leading-12">
          Những câu hỏi thường gặp
        </div>
        <Accordion type="single" collapsible className="lg:w-[60%] mt-6 lg:mt-10">
          {FAQS_LIST.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}

export default FaqPage;
