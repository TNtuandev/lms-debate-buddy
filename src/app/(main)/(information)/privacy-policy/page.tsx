import React from "react";
import { HeaderSection } from "@/components/common/HeaderSection";
import { POLICY_LIST } from "@/contants/policy";

function PolicyPrivacyPage() {
  return (
    <div>
      <HeaderSection title="Chính sách bảo mật" label="Trang chủ" subLabel="Chính sách bảo mật" />
      <div className="py-12 lg:py-32 px-6 md:max-w-3xl max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto w-full flex flex-col items-center justify-center h-full">
        <div className="lg:w-[70%] flex flex-col gap-6">
          {POLICY_LIST.map((item, idx) => (
            <div key={idx}>
              <div className='font-bold text-2xl leading-9'>{item.title}</div>
              <div className="text-secondary mt-2">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PolicyPrivacyPage;
