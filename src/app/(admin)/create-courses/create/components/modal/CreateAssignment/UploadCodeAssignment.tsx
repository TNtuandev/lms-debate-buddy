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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, {useEffect, useMemo, useRef, useState} from "react";
import CKEditorWrapper from "@/components/courses/editor/CKEditorWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { InfoCircle } from "iconsax-react";
import {
  UploadAssignmentFormData,
  uploadAssignmentSchema,
} from "../../../schemas";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";
import {
  useCreateLessonPractice,
  useGetLessonById,
  useUpdateLessonPractice,
} from "@/hooks/queries/course/useLessonCourse";
import { useUploadFile } from "@/hooks/queries/course/useUploadFile";

interface UploadCodeAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UploadAssignmentFormData) => void;
}

export const UploadCodeAssignment = ({
  isOpen,
  onClose,
  onSubmit,
}: UploadCodeAssignmentProps) => {
  const [inputDataFile, setInputDataFile] = useState<File | null>(null);
  const [outputDataFile, setOutputDataFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const inputDataInputRef = useRef<HTMLInputElement>(null);
  const outputDataInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const { courseData, lessonSelected, moduleSelected } =
    useCreateCourseContext();
  const isEdit = Boolean(lessonSelected?.id);
  const { data: initValue, refetch } = useGetLessonById(
    courseData?.id as string,
    moduleSelected?.id as string,
    lessonSelected?.id as string,
  );

  const form = useForm<UploadAssignmentFormData>({
    resolver: zodResolver(uploadAssignmentSchema),
    defaultValues: {
      title: "",
      practiceType: "coding",
      htmlContent: "",
      description: "",
      inputFile: undefined,
      outputFile: undefined,
      suggestion: "",
      // sampleData: "",
      // answer: "",
      attachmentUrl: undefined,
      passingScore: undefined,
      duration: undefined,
    },
  });

  useEffect(() => {
    if (lessonSelected) {
      form.reset(initValue);
      setInputDataFile(null);
      setOutputDataFile(null);
      setAttachmentFile(null);
    } else {
      form.reset({
        title: "",
        practiceType: "coding",
        language: "JAVA", // Default language
        htmlContent: "",
        description: "",
        inputFile: undefined,
        outputFile: undefined,
        suggestion: "",
        // sampleData: "",
        // answer: "",
        attachmentUrl: undefined,
        passingScore: undefined,
        duration: undefined,
      });
      setInputDataFile(null);
      setOutputDataFile(null);
      setAttachmentFile(null);
    }
  }, [lessonSelected, initValue]);

  console.log("UploadCodeAssignment render", form.formState.errors);

  const practiceType = form.watch("practiceType");
  const language = form.watch("language");

  const createPractice = useCreateLessonPractice(
    courseData?.id as string,
    moduleSelected?.id as string,
  );
  const updatePractice = useUpdateLessonPractice(
    courseData?.id as string,
    moduleSelected?.id as string,
    lessonSelected?.id as string,
  );

  const handleClose = () => {
    form.reset();
    setInputDataFile(null);
    setOutputDataFile(null);
    setAttachmentFile(null);
    onClose();
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
    });
  };

  const handleSubmit = (data: UploadAssignmentFormData) => {
    const formRequest = {
      ...data,
      attachmentUrl: data.attachmentUrl || "",
      duration: data.duration ? Number(data.duration) : 0,
      passingScore: data.passingScore ? Number(data.passingScore) : 0,
    };
    if (isEdit) {
      updatePractice.mutate(formRequest as any, {
        onSuccess: (res) => {
          refetch();
          onSubmit(res);
          handleClose();
        },
      });
      return;
    }
    createPractice.mutate(formRequest as any, {
      onSuccess: (res) => {
        onSubmit(res);
        handleClose();
      },
    });
  };

  const acceptFiles = useMemo(() => {
    switch (language) {
      case "C++":
        return ".cpp,.h";
      case "JAVA":
        return ".java";
      default:
        return ".txt,.json"; // Default for other languages
    }
  }, [language])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-white p-0 rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 border-b border-[#919EAB52] text-left">
          <DialogTitle className="text-lg text-left font-medium text-gray-900">
            Thêm bài tập
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="p-6 space-y-5"
            onSubmit={form.handleSubmit(handleSubmit)}
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
            {/* Loại bài tập */}
            <FormField
              control={form.control}
              name="practiceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại bài tập</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Coding" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coding">Coding</SelectItem>
                        <SelectItem value="upload_file">
                          Tải lên tài liệu
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Nội dung */}
            <FormField
              control={form.control}
              name="htmlContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <CKEditorWrapper
                      value={field?.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Viết gì đó..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Mô tả */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả chi tiết" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fields cho practiceType = "coding" */}
            {practiceType === "coding" && (
              <>
                {/*Ngôn ngữ*/}
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngôn ngữ</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Ngôn ngữ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="C++">C++</SelectItem>
                            <SelectItem value="JAVA">
                              JAVA
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Dữ liệu đầu vào */}
                <FormField
                  control={form.control}
                  name="inputFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Dữ liệu đầu vào
                      </FormLabel>
                      <FormControl>
                        <div
                          className="border-2 border-dashed bg-[#919EAB]/8 border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                          onClick={() => inputDataInputRef.current?.click()}
                        >
                          {!field.value ? (
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
                                {inputDataFile?.name}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInputDataFile(null);
                                  field.onChange(null);
                                  if (inputDataInputRef.current) {
                                    inputDataInputRef.current.value = "";
                                  }
                                }}
                              >
                                Xóa
                              </Button>
                            </div>
                          )}
                          <input
                            type="file"
                            accept={acceptFiles}
                            ref={inputDataInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setInputDataFile(file);
                                handleUploadFile(file, field);
                              }
                            }}
                            className="hidden"
                            id="input-data-upload"
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500 gap-1 mt-2 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#637381" />
                        <span className="font-medium">
                          Kích thước:
                        </span> 10Mb.{" "}
                        <span className="font-medium">Hỗ trợ tệp:</span> TXT,
                        JSON
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Dữ liệu đầu ra */}
                <FormField
                  control={form.control}
                  name="outputFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Dữ liệu đầu ra
                      </FormLabel>
                      <FormControl>
                        <div
                          className="border-2 border-dashed bg-[#919EAB]/8 border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                          onClick={() => outputDataInputRef.current?.click()}
                        >
                          {!field.value ? (
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
                                {outputDataFile?.name}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOutputDataFile(null);
                                  field.onChange(null);
                                  if (outputDataInputRef.current) {
                                    outputDataInputRef.current.value = "";
                                  }
                                }}
                              >
                                Xóa
                              </Button>
                            </div>
                          )}
                          <input
                            type="file"
                            accept={acceptFiles}
                            ref={outputDataInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setOutputDataFile(file);
                                handleUploadFile(file, field);
                              }
                            }}
                            className="hidden"
                            id="output-data-upload"
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500 gap-1 mt-2 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#637381" />
                        <span className="font-medium">
                          Kích thước:
                        </span> 10Mb.{" "}
                        <span className="font-medium">Hỗ trợ tệp:</span> TXT,
                        JSON
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Gợi ý */}
                <FormField
                  control={form.control}
                  name="suggestion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gợi ý</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Gợi ý" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Dữ liệu mẫu */}
                {/*<FormField*/}
                {/*  control={form.control}*/}
                {/*  name="sampleData"*/}
                {/*  render={({ field }) => (*/}
                {/*    <FormItem>*/}
                {/*      <FormLabel>Dữ liệu mẫu (Tuỳ chọn)</FormLabel>*/}
                {/*      <FormControl>*/}
                {/*        <CodeMirror*/}
                {/*          value={field.value || ""}*/}
                {/*          height="200px"*/}
                {/*          extensions={[cpp()]}*/}
                {/*          theme="light"*/}
                {/*          onChange={field.onChange}*/}
                {/*          basicSetup={{ lineNumbers: true }}*/}
                {/*        />*/}
                {/*      </FormControl>*/}
                {/*      <FormMessage />*/}
                {/*    </FormItem>*/}
                {/*  )}*/}
                {/*/>*/}
                {/* Đáp án */}
                {/*<FormField*/}
                {/*  control={form.control}*/}
                {/*  name="answer"*/}
                {/*  render={({ field }) => (*/}
                {/*    <FormItem>*/}
                {/*      <FormLabel>Đáp án</FormLabel>*/}
                {/*      <FormControl>*/}
                {/*        <CodeMirror*/}
                {/*          value={field.value || ""}*/}
                {/*          height="200px"*/}
                {/*          extensions={[cpp()]}*/}
                {/*          theme="light"*/}
                {/*          onChange={field.onChange}*/}
                {/*          basicSetup={{ lineNumbers: true }}*/}
                {/*        />*/}
                {/*      </FormControl>*/}
                {/*      <FormMessage />*/}
                {/*    </FormItem>*/}
                {/*  )}*/}
                {/*/>*/}
              </>
            )}

            {/* Fields cho practiceType = "upload_file" */}
            {practiceType === "upload_file" && (
              <>
                {/* Tải lên tệp đính kèm */}
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
                                handleUploadFile(file, field);
                              }
                            }}
                            className="hidden"
                            id="attachment-upload"
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500 gap-1 mt-2 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#637381" />
                        <span className="font-medium">
                          Kích thước:
                        </span> 10Mb.{" "}
                        <span className="font-medium">Hỗ trợ tệp:</span> PDF,
                        DOC, DOCX, TXT
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Thời gian tối đa */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian tối đa (phút)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Nhập thời gian tối đa"
                          value={field.value || undefined}
                          onChange={(event) => {
                            field.onChange(Number(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Điểm đạt */}
                <FormField
                  control={form.control}
                  name="passingScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Điểm đạt</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập điểm đạt"
                          {...field}
                          value={field.value || undefined}
                          onChange={(event) => {
                            field.onChange(Number(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter className="flex justify-end space-x-3 pt-4 border-t border-[#919EAB52]">
              <Button
                type="button"
                size="sm"
                className="bg-[#FFF1F1] hover:bg-[#FEE2E2] text-[#E53935]"
                onClick={handleClose}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Thêm bài tập
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
