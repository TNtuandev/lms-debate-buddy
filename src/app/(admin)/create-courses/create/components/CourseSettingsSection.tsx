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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Minus, Plus } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import { InfoCircle } from "iconsax-react";
import {
  fullCourseFormData,
  SettingCourseFormData,
  settingCourseSchema,
} from "@/app/(admin)/create-courses/create/schemas";
import { DIFFICULTY_LEVEL } from "@/api/utils/course";
import { zodResolver } from "@hookform/resolvers/zod";

interface CourseSettingsSectionProps {
  onNext: (data: SettingCourseFormData) => void;
  onBack: () => void;
  initialData?: Partial<fullCourseFormData>;
}

export default function CourseSettingsSection({
  onNext,
  onBack,
  initialData,
}: CourseSettingsSectionProps) {
  const [courseSettingsExpanded, setCourseSettingsExpanded] = useState(true);

  const form = useForm<SettingCourseFormData>({
    resolver: zodResolver(settingCourseSchema),
  });

  const [studentCount, setStudentCount] = useState(100);

  useEffect(() => {
    form.reset({
      difficulty: initialData?.difficulty || "",
      isPublic: initialData?.isPublic || false,
      enableQA: initialData?.enableQA || true,
      enableDrip: initialData?.enableDrip || true,
    })
  }, []);

  const onSubmit = (data: SettingCourseFormData) => {
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
            onClick={() => setCourseSettingsExpanded(!courseSettingsExpanded)}
          >
            <h3 className="text-base font-medium text-gray-900">
              Cài đặt khóa học
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                courseSettingsExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {courseSettingsExpanded && (
            <div className="p-4 border-t border-t-gray-300 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Difficulty Level */}
                <div className="col-span-1 md:col-span-2">
                  <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                    Mức độ khó
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-lg border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Tất cả cấp độ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DIFFICULTY_LEVEL.map((level) => (
                              <SelectItem
                                key={level?.value}
                                value={level?.value}
                              >
                                {level?.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <InfoCircle variant="Bold" size={16} color="#637381" />
                    <span className="ml-1">Tiêu đề để dài tối đa 30 ký tự</span>
                  </p>
                </div>

                {/* Student Count */}
                <div>
                  <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                    Số lượng học viên tối đa
                  </FormLabel>
                  <div className="flex items-center justify-between h-11 w-full rounded-lg bg-gray-100 px-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setStudentCount(Math.max(0, studentCount - 1))
                      }
                      className="h-8 w-8 text-gray-500 hover:bg-gray-200"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-base font-medium text-gray-900">
                      {studentCount}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setStudentCount(studentCount + 1)}
                      className="h-8 w-8 text-gray-500 hover:bg-gray-200"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <InfoCircle variant="Bold" size={16} color="#637381" />
                    <span className="ml-1">Đặt 0 để không giới hạn.</span>
                  </p>
                </div>
              </div>
              <hr className="border-dashed border-[#919EAB]/24" />
              Toggle Options
              <div className="space-y-4 flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-center justify-between">
                      <FormLabel className="mb-0 text-sm font-medium text-gray-700 cursor-pointer">
                        Công khai khóa học
                      </FormLabel>
                      <FormControl>
                        <ToggleSwitch
                          value={field.value || false}
                          onChange={field.onChange}
                          color="blue"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableQA"
                  render={({ field }) => (
                    <FormItem className="gap-2 flex items-center justify-between">
                      <FormLabel className="mb-0 text-sm font-medium text-gray-700 cursor-pointer">
                        Hỏi & Đáp
                      </FormLabel>
                      <FormControl>
                        <ToggleSwitch
                          value={field.value || false}
                          onChange={field.onChange}
                          color="blue"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableDrip"
                  render={({ field }) => (
                    <FormItem className="gap-2 flex items-center justify-between">
                      <FormLabel className="mb-0 text-sm font-medium text-gray-700 cursor-pointer">
                        Nội dung nhỏ giọt
                      </FormLabel>
                      <FormControl>
                        <ToggleSwitch
                          value={field.value || false}
                          onChange={field.onChange}
                          color="blue"
                        />
                      </FormControl>
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
