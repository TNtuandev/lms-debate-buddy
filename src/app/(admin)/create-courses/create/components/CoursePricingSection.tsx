"use client";

import { FormProvider, useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ToggleSwitch from "./ToggleSwitch";
import {
  fullCourseFormData,
  PricingCourseFormData,
  pricingCourseSchema,
} from "@/app/(admin)/create-courses/create/schemas";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

interface CoursePricingSectionProps {
  onNext: (data: PricingCourseFormData) => void;
  onBack: () => void;
  initialData?: Partial<fullCourseFormData>;
}

export default function CoursePricingSection({
  onNext,
  onBack,
  initialData,
}: CoursePricingSectionProps) {
  const form = useForm<PricingCourseFormData>({
    resolver: zodResolver(pricingCourseSchema),
    defaultValues: {
      regularPrice: initialData?.regularPrice || 0,
      discountedPrice: initialData?.discountedPrice || 0,
      isFree: initialData?.isFree,
    },
  });

  useEffect(() => {
    form.reset({
      regularPrice: initialData?.regularPrice || 0,
      discountedPrice: initialData?.discountedPrice || 0,
      isFree: initialData?.isFree,
    });
  }, [initialData]);

  const onSubmit = (data: PricingCourseFormData) => {
    // Call onNext to pass data back to parent component
    console.log("Step 2 form data:", data);
    onNext(data);
  };

  const isFree = form.watch("isFree");

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-white shadow-sm border border-gray-200">
          {/*<div*/}
          {/*  className="flex items-center justify-between p-4 cursor-pointer transition-colors"*/}
          {/*  onClick={() => setPricingExpanded(!pricingExpanded)}*/}
          {/*>*/}
          {/*  <h3 className="text-base font-medium text-gray-900">*/}
          {/*    Giá khóa học*/}
          {/*  </h3>*/}
          {/*  <ChevronDown*/}
          {/*    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${*/}
          {/*      pricingExpanded ? "rotate-180" : ""*/}
          {/*    }`}*/}
          {/*  />*/}
          {/*</div>*/}

          <div className="p-4 border-t border-t-gray-300 space-y-4">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 p-3 rounded-lg">
                  <FormControl className="flex items-center">
                    <ToggleSwitch
                      value={field.value || false}
                      onChange={field.onChange}
                      color="gray"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">
                    Khóa học miễn phí
                  </FormLabel>
                </FormItem>
              )}
            />

            {!isFree && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="regularPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Giá gốc
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            đ
                          </span>
                          <Input
                            placeholder="0"
                            type="number"
                            className="h-10 pl-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Giá khuyến mãi
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            đ
                          </span>
                          <Input
                            placeholder="0"
                            type="number"
                            className="h-10 pl-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
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
