import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { InfoCircle } from "iconsax-react";
import ToggleSwitch from "../ToggleSwitch";
import {
  LessonFormData,
  lessonSchema,
} from "@/app/(admin)/create-courses/create/schemas";
import CKEditorWrapper from "@/components/courses/editor/CKEditorWrapper";
import {
  useCreateLessonArticle,
  useCreateLessonVideo, useGetLessonById,
  useUpdateLessonArticle,
  useUpdateLessonVideo,
} from "@/hooks/queries/course/useLessonCourse";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";
import {useUploadFile} from "@/hooks/queries/course/useUploadFile";

interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const CreateLessonModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateLessonModalProps) => {
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const { courseData, lessonSelected, moduleSelected } =
    useCreateCourseContext();
  const isEdit = Boolean(lessonSelected?.id);

  const { data: initValue, refetch } = useGetLessonById(courseData?.id as string, moduleSelected?.id as string, lessonSelected?.id as string)

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lessonSelected?.title || "",
      description: lessonSelected?.description || "",
      type: lessonSelected?.type || "VIDEO",
      videoUrl: lessonSelected?.videoUrl || null,
      duration: lessonSelected?.duration || 0,
      htmlContent: lessonSelected?.htmlContent || "",
      sampleImageUrl: lessonSelected?.sampleImageUrl || "",
      attachmentUrl: null,
      isPreviewable: lessonSelected?.isPreviewable || true,
    },
  });

  useEffect(() => {
    if (lessonSelected) {
      form.reset(initValue);
      setAttachmentFile(null);
    } else {
      form.reset({
        title: "",
        description: "",
        type: "VIDEO",
        videoUrl: null,
        duration: undefined,
        htmlContent: "",
        sampleImageUrl: "",
        attachmentUrl: null,
        isPreviewable: true,
      });
    }
  }, [lessonSelected, initValue]);

  const handleClose = () => {
    setAttachmentFile(null);
    form.reset();
    onClose();
  };

  const createLessonVideo = useCreateLessonVideo(
    courseData?.id as string,
    moduleSelected?.id as string,
  );
  const updateLessonVideo = useUpdateLessonVideo(
    courseData?.id as string,
    moduleSelected?.id as string,
    lessonSelected?.id as string,
  );
  const createLessonArticle = useCreateLessonArticle(
    courseData?.id as string,
    moduleSelected?.id as string,
  );
  const updateLessonArticle = useUpdateLessonArticle(
    courseData?.id as string,
    moduleSelected?.id as string,
    lessonSelected?.id as string,
  );
  const handleCreateLesson = (data: LessonFormData) => {
    if (lessonType === "VIDEO") {
      const formData = {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        duration: Number(data.duration),
        attachmentUrl: data.attachmentUrl,
        sampleImageUrl: data.sampleImageUrl,
        isPreviewable: data.isPreviewable,
      };
      if (isEdit) {
        updateLessonVideo.mutate(formData as any, {
          onSuccess: () => {
            form.reset();
            onSubmit();
            refetch();
            onClose();
          },
        });
        return;
      }
      createLessonVideo.mutate(formData as any, {
        onSuccess: () => {
          form.reset();
          onSubmit();
          onClose();
        },
      });
    } else {
      const formData = {
        title: data.title,
        description: data.description,
        htmlContent: data.htmlContent,
        sampleImageUrl: data.sampleImageUrl,
        duration: Number(data.duration),
      };
      if (isEdit) {
        updateLessonArticle.mutate(formData, {
          onSuccess: () => {
            form.reset();
            onSubmit();
            onClose();
          },
        });
        return;
      }
      createLessonArticle.mutate(formData, {
        onSuccess: () => {
          onSubmit();
          onClose();
          form.reset();
        },
      });
    }
  };
  const lessonType = form.watch("type");

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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-white p-0 rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 border-b border-[#919EAB52] text-left">
          <DialogTitle className="text-lg text-left font-medium text-gray-900">
            Thêm bài học
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateLesson)}
            className="p-6 space-y-5"
          >
            {/* Tiêu đề */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Tiêu đề" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Loại bài học */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại bài học</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại bài học" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIDEO">Video</SelectItem>
                        <SelectItem value="ARTICLE">Tài liệu</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Tóm tắt */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tóm tắt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tóm tắt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Nội dung */}
            {lessonType === "ARTICLE" && (
              <FormField
                control={form.control}
                name="htmlContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <CKEditorWrapper
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Viết gì đó..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Ảnh đại diện */}
            <FormField
              control={form.control}
              name="sampleImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Hình thu nhỏ
                  </FormLabel>
                  <FormControl>
                    <div
                      className="border-2 border-dashed bg-[#919EAB]/8 border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={() => thumbnailInputRef.current?.click()}
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
                              if (thumbnailInputRef.current) {
                                thumbnailInputRef.current.value = "";
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
                        ref={thumbnailInputRef}
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
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Thời gian học
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="00"
                        className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                        value={field.value || undefined}
                        onChange={(event) => {
                          field.onChange(Number(event.target.value));
                        }}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500 flex items-center">
                      <InfoCircle
                        variant="Bold"
                        size={16}
                        color="#637381"
                      />
                      <span className="ml-1">Giờ</span>
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thêm URL Video */}
            {lessonType === "VIDEO" && (
              <>

                <FormField control={form.control} name="videoUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thêm URL Video của bạn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://youtube.com/..."
                        {...field as any}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      VD:{" "}
                      <span className="text-primary-main underline">
                          https://www.youtube.com/watch?v=your-video-id
                        </span>
                    </p>
                  </FormItem>
                )}/>
                {/* Thời gian phát lại video */}

                {/* File đính kèm */}
                <FormField
                  control={form.control}
                  name="attachmentUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Tải lên tệp đính kèm
                      </FormLabel>
                      <FormControl>
                        <div
                          className="border-2 border-dashed bg-[#919EAB]/8 border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                          onClick={() => attachmentInputRef.current?.click()}
                        >
                          {!field?.value ? (
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 bg-[#919EAB]/8 rounded-full flex items-center justify-center mb-4">
                                <Image
                                  width={64}
                                  height={64}
                                  alt="file"
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
                              <p className="text-sm text-gray-500 mb-2">
                                {attachmentFile?.name}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAttachmentFile(null);
                                  field.onChange(null);
                                  if (attachmentInputRef.current) {
                                    attachmentInputRef.current.value = "";
                                  }
                                }}
                              >
                                Xóa
                              </Button>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="/*"
                            ref={attachmentInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setAttachmentFile(file);
                                handleUploadFile(file,  field)
                              }
                            }}
                            className="hidden"
                            id="attachment-upload"
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Kích thước tối đa:</span>{" "}
                        100MB. <span className="font-medium">Hỗ trợ:</span> PDF,
                        ZIP, RAR
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Bật chế độ xem trước khóa học */}
                <FormField
                  control={form.control}
                  name="isPreviewable"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <ToggleSwitch
                          value={field.value || false}
                          onChange={field.onChange}
                          color="green"
                        />
                      </FormControl>
                      <FormLabel className="">
                        Bật chế độ xem trước khóa học
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter className="flex justify-end space-x-3 pt-4 border-t border-[#919EAB52]">
              <Button
                type="button"
                size="sm"
                onClick={handleClose}
                className="bg-[#FFF1F1] hover:bg-[#FEE2E2] text-[#E53935]"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Thêm chủ đề
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
