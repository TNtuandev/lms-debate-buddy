import { ArrowRight2 } from "iconsax-react";
import React from "react";

interface HeaderSectionProps {
  title: string;
  label: string;
  subLabel: string;
}

export function HeaderSection({title, subLabel, label}: HeaderSectionProps) {
  return (
    <div className="bg-gradient-to-tr from-primary-main/16  to-secondary-main/16 h-[300px]">
      <div className="px-6 md:max-w-3xl max-w-sm lg:max-w-5xl xl:max-w-7xl mx-auto w-full flex flex-col items-center justify-center h-full">
        <div className="font-bold text-3xl lg:text-5xl lg:leading-16">{title}</div>
        <div className="mt-2 text-sm flex items-center justify-between gap-2">
          <span>{label}</span>
          <ArrowRight2 size="14" color="#212B36" />
          <span className="text-secondary">{subLabel}</span>
        </div>
      </div>
    </div>
  )
}