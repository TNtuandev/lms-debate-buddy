"use client";

import {useEffect, useState} from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import {
  fullCourseFormData,
  infoCourseSchema,
  InfoFormData,
} from "@/app/(admin)/create-courses/create/schemas";
import { InfoCircle } from "iconsax-react";
import { COURSE_LABELS } from "@/api/utils/course";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

interface CourseInfoSectionProps {
  onNext: (data: InfoFormData) => void;
  onBack: () => void;
  initialData?: Partial<fullCourseFormData>;
}

export default function CourseInfoSection({
  onNext,
  onBack,
  initialData,
}: CourseInfoSectionProps) {
  const [infoExpanded, setInfoExpanded] = useState(true);

  const form = useForm<InfoFormData>({
    resolver: zodResolver(infoCourseSchema),
  });

  useEffect(() => {
    form.reset({
      requirements: initialData?.requirements || "",
      hourCourse: initialData?.hourCourse || 0,
      learningOutcomes: initialData?.learningOutcomes || "",
      minutesCourse: initialData?.minutesCourse || 0,
      description: initialData?.description || "",
      label: initialData?.label || "",
    })
  }, [initialData]);

  const onSubmit = (data: InfoFormData) => {
    // Call onNext to pass data back to parent component
    console.log("Step 2 form data:", data);
    onNext(data);
  };
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className=" bg-white py-4 shadow-sm border border-gray-200">
          <div
            className="flex items-center justify-between p-4 cursor-pointer transition-colors"
            onClick={() => setInfoExpanded(!infoExpanded)}
          >
            <h3 className="text-base font-medium text-gray-900">
              Thêm thông tin
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                infoExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {infoExpanded && (
            <div className="p-4 border-t border-t-gray-300 space-y-6">
              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Mô tả ngắn
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Viết mô tả ngắn gọn về khóa học..."
                        className="min-h-[80px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requirements Field */}
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Yêu cầu
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Yêu cầu"
                        className="min-h-[80px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Learning Outcomes Field */}
              <FormField
                control={form.control}
                name="learningOutcomes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Kết quả học tập
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Kết quả học tập"
                        className="min-h-[80px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <InfoCircle variant="Bold" size={16} color="#637381" />
                      <span className="ml-1">
                        Kết quả người dùng sẽ đạt được sau khi kết thúc khóa học
                      </span>
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration: giờ và phút */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hourCourse"
                  render={({ field,  }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Tổng thời lượng
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="00"
                          className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#637381" />
                        <span className="ml-1">Giờ</span>
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minutesCourse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 opacity-0">
                        Ẩn
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="00"
                          className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#637381" />
                        <span className="ml-1">Phút</span>
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Toggle Switches */}
              <div className="space-y-4 pt-4">
                {/* Sale Toggle */}
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Nhãn
                      </FormLabel>
                      {COURSE_LABELS.map((item) => {
                        return (
                          <div
                            key={item.label}
                            className="flex items-center gap-4 mt-1"
                          >
                            <FormControl>
                              <ToggleSwitch
                                value={field.value === item.value}
                                onChange={() => {
                                  field.onChange(item.value);
                                }}
                                color="green"
                              />
                            </FormControl>
                            <div className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50/70">
                              {item.label}
                            </div>
                          </div>
                        );
                      })}
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </Card>
        <div className="flex items-center justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6 text-primary-contrastText"
          >
            Quay lại
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6 text-primary-contrastText"
          >
            Huỷ bỏ
          </Button>
          <Button
            type="submit"
            className="px-8 bg-[#212B36] hover:bg-blue-700 text-white"
          >
            Tiếp tục
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
