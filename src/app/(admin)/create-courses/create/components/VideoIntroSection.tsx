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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { InfoCircle } from "iconsax-react";
import {
  fullCourseFormData,
  VideoIntroFormData,
  videoIntroSchema,
} from "@/app/(admin)/create-courses/create/schemas";
import { Button } from "@/components/ui/button";
import {useEffect, useRef, useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {useUploadFile} from "@/hooks/queries/course/useUploadFile";
import Image from "next/image";

const typeSource = [
  {
    value: "Hình ảnh",
    label: "Hình ảnh",
  },
  {
    value: "Video",
    label: "Video",
  },
];

interface VideoIntroSectionProps {
  onNext: (data: VideoIntroFormData) => void;
  onBack: () => void;
  initialData?: Partial<fullCourseFormData>;
}

export default function VideoIntroSection({
  onNext,
  onBack,
  initialData,
}: VideoIntroSectionProps) {
  const [isExpanded, setIsExpand] = useState(true);
  const [type, setTypeSource] = useState(typeSource[0].value);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<VideoIntroFormData>({
    resolver: zodResolver(videoIntroSchema),
  });

  useEffect(() => {
    form.reset({
      previewVideo: initialData?.previewVideo || "",
      previewImg: initialData?.previewImg || "",
    })
  }, [initialData]);

  const onSubmit = (data: VideoIntroFormData) => {
    // Call onNext to pass data back to parent component
    console.log("Step 4 form data:", data);
    onNext(data);
  };

  const { uploadFile } = useUploadFile();

  const handleUploadFile = (file: File, field: any) => {
    const formData = new FormData();
    formData.append("file", file);
    uploadFile.mutate(formData, {
      onSuccess: (response) => {
        field.onChange(response.url); // Assuming the API returns the file URL
      },
      onError: (error) => {
        console.error("Error uploading file:", error);
      },
    })
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-white py-4 shadow-sm border border-gray-200">
          <div
            className="flex items-center justify-between p-4 cursor-pointer  transition-colors"
            onClick={() => setIsExpand(!isExpanded)}
          >
            <h3 className="text-base font-medium text-gray-900">
              Video giới thiệu
            </h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {isExpanded && (
            <div className="p-4 border-t border-t-gray-300 space-y-4">
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Loại
                </FormLabel>
                <Select
                  onValueChange={(value) => setTypeSource(value)}
                  defaultValue={type}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Youtube" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {typeSource.map((item) => {
                      return (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="previewVideo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Thêm URL Video của bạn
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Thêm URL Video của bạn"
                        className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500 flex items-center">
                      <InfoCircle
                        size={16}
                        color="#637381"
                        variant="Bold"
                        className="mr-1"
                      />
                      Ví dụ:{" "}
                      <a className="text-blue-500">
                        https://www.youtube.com/watch?v=yourvideoid
                      </a>
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="previewImg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Thêm hình ảnh video của bạn
                    </FormLabel>
                    <FormControl>
                      <div
                        className="border-2 border-dashed bg-[#919EAB]/8 border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onClick={() => inputRef.current?.click()}
                      >
                        {!field?.value ? (
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#919EAB]/8 rounded-full flex items-center justify-center mb-4">
                              <Image
                                width={64}
                                height={64}
                                alt="image"
                                src="/images/upload.png"
                              />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              Thả hoặc chọn tệp tin
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                              Thả tệp tin vào đây hoặc nhấp để{" "}
                              <span className="text-blue-600 hover:underline cursor-pointer">
                          duyệt
                        </span>{" "}
                              từ máy tính
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Image
                              src={field?.value}
                              alt="Thumbnail Preview"
                              width={1000}
                              height={600}
                              className="rounded-lg mb-4"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              Xóa
                            </Button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          ref={inputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleUploadFile(file, field);
                            }
                          }}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Kích thước:</span> 700x430 pixel,{" "}
                      <span className="font-medium">Hỗ trợ tệp:</span> JPG, JPEG, PNG,
                      GIF, WEBP
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
