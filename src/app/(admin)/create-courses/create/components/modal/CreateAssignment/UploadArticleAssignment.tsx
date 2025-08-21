import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useRef, useState } from "react";
import Image from "next/image";
import CKEditorWrapper from "@/components/courses/editor/CKEditorWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoCircle } from "iconsax-react";

const uploadAssignmentSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  type: z.enum(["document"]),
  content: z.string().min(1, "Nội dung không được để trống"),
  attachment: z
    .any()
    .refine((file) => !file || (file && file.size <= 10 * 1024 * 1024), {
      message: "Kích thước tệp tối đa là 10MB",
    }),
  duration: z.string().min(1, "Vui lòng nhập thời gian tối đa"),
  durationUnit: z.enum(["hour"]),
  passScore: z.string().min(1, "Vui lòng nhập điểm đạt"),
});
type UploadAssignmentFormData = z.infer<typeof uploadAssignmentSchema>;

interface UploadArticleAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UploadAssignmentFormData) => void;
}

export const UploadArticleAssignment = ({
  isOpen,
  onClose,
  onSubmit,
}: UploadArticleAssignmentProps) => {
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UploadAssignmentFormData>({
    resolver: zodResolver(uploadAssignmentSchema),
    defaultValues: {
      title: "",
      type: "document",
      content: "",
      attachment: undefined,
      duration: "00",
      durationUnit: "hour",
      passScore: "50",
    },
  });

  const handleClose = () => {
    setAttachmentFile(null);
    form.reset();
    onClose();
  };

  const handleSubmit = (data: UploadAssignmentFormData) => {
    onSubmit(data);
    handleClose();
  };

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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại bài tập</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Tải lên tài liệu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <CKEditorWrapper
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Viết gì đó..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Tải lên tệp đính kèm */}
            <FormField
              control={form.control}
              name="attachment"
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
                      {!attachmentFile ? (
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
                            {attachmentFile.name}
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
                        accept=".pdf,.zip,.rar"
                        ref={attachmentInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAttachmentFile(file);
                            field.onChange(file);
                          }
                        }}
                        className="hidden"
                        id="attachment-upload"
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-gray-500 gap-1 mt-2 flex items-center">
                    <InfoCircle variant="Bold" size={16} color="#637381" />
                    <span className="font-medium">Kích thước:</span> 10Mb.{" "}
                    <span className="font-medium">Hỗ trợ tệp:</span> PDF, ZIP,
                    RAR
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Thời gian tối đa */}
            <div>
              <div className="grid grid-cols-2 gap-4 items-center">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian tối đa</FormLabel>
                      <FormControl>
                        <Input placeholder="00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="opacity-0">Ẩn</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Giờ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hour">Giờ</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-xs mt-2 text-gray-500 flex items-center">
                <InfoCircle variant="Bold" size={16} color="#637381" />
                <span className="ml-1">
                  Giới hạn thời gian tối đa để nộp bài
                </span>
              </p>
            </div>
            {/* Điểm đạt */}
            <FormField
              control={form.control}
              name="passScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm đạt (%)</FormLabel>
                  <FormControl>
                    <Input placeholder="50" {...field} />
                  </FormControl>
                  <FormMessage />

                  <p className="text-xs text-gray-500 flex items-center">
                    <InfoCircle variant="Bold" size={16} color="#637381" />
                    <span className="ml-1">
                      Điểm tối thiểu cần đạt để học sinh có thể vượt qua bài tập
                      này.
                    </span>
                  </p>
                </FormItem>
              )}
            />
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
