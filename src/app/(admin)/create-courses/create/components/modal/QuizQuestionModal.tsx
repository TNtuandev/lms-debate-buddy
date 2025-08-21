import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CKEditorWrapper from "@/components/courses/editor/CKEditorWrapper";
import ToggleSwitch from "../ToggleSwitch";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "iconsax-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {useEffect} from "react";

export enum QuestionType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  SHORT_ANSWER = "SHORT_ANSWER",
}

const answerSchema = z.object({
  content: z.string().optional(),
  isCorrect: z.boolean().optional(),
}).refine((data) => data.content && data.content.trim().length > 0, {
  message: "Nội dung đáp án không được để trống",
  path: ["content"],
});

export const questionSchema = z
  .object({
    content: z.string().min(1, "Câu hỏi không được để trống"),
    type: z.string().min(1, "Chọn loại câu hỏi"),
    point: z.string().min(1, "Nhập điểm cho câu trả lời"),
    isRandom: z.boolean().optional(),
    isRequiredAnswer: z.boolean().optional(),
    description: z.string().optional(),
    options: z.array(answerSchema).optional(),
    correctExplanation: z.string().optional(),
    answer: z.string().optional(),
    incorrectHint: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Chỉ validate options khi có options và là loại câu hỏi cần options
    if (data.options && Array.isArray(data.options) && data.options.length > 0) {
      if (data.type === QuestionType.MULTIPLE_CHOICE) {
        const correctOptions = data.options.filter((option) => option.isCorrect);
        if (correctOptions.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Câu hỏi nhiều đáp án cần ít nhất 2 đáp án",
            path: ["options"],
          });
        }
      }

      if (data.type === "SINGLE_CHOICE") {
        const correctOptions = data.options.filter((option) => option.isCorrect);
        if (correctOptions.length !== 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Có 1 đáp án đúng cho câu hỏi này",
            path: ["options"],
          });
        }
      }
    }
  })
  .refine(
    (data) => {
      // Validation cho loại câu hỏi short
      if (data.type === QuestionType.SHORT_ANSWER) {
        return data.answer && data.answer.trim().length > 0;
      }
      return true;
    },
    {
      message: "Câu trả lời ngắn không được để trống",
      path: ["answer"],
    },
  );

export type QuestionFormData = z.infer<typeof questionSchema>;

interface QuizQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuestionFormData) => void;
  defaultValues?: Partial<QuestionFormData>;
}

export default function QuizQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}: QuizQuestionModalProps) {
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: defaultValues || {
      content: "",
      type: "SINGLE_CHOICE",
      point: "10",
      isRandom: false,
      isRequiredAnswer: false,
      description: "",
      options: [],
      correctExplanation: "",
      incorrectHint: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    } else {
      form.reset({
        content: "",
        type: "SINGLE_CHOICE",
        point: "10",
        isRandom: false,
        isRequiredAnswer: false,
        description: "",
        options: [],
        correctExplanation: "",
        incorrectHint: "",
      });
    }
  }, [defaultValues]);

  console.log("QuizQuestionModal defaultValues:", form.formState.errors, form.getValues());

  const handleSubmit = (value: QuestionFormData) => {
    onSubmit(value);
    onClose();
    form.reset();
  };

  const handleClose = () => {
    onClose();
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-white p-0 rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 border-b border-[#919EAB52] text-left">
          <DialogTitle className="text-lg text-left font-medium text-gray-900">
            {defaultValues ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="p-6 space-y-5"
          >
            {/* Nhập câu hỏi */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập câu hỏi</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập câu hỏi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Loại câu hỏi & điểm */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại câu hỏi</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Chọn loại câu hỏi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={QuestionType.SINGLE_CHOICE}>
                            1 Đáp án
                          </SelectItem>
                          <SelectItem value={QuestionType.MULTIPLE_CHOICE}>
                            Nhiều đáp án
                          </SelectItem>
                          <SelectItem value={QuestionType.SHORT_ANSWER}>
                            Câu trả lời ngắn
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="point"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điểm cho câu trả lời</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Switch random & required */}
            <div className="grid grid-cols-2 gap-8 mb-2">
              <FormField
                control={form.control}
                name="isRandom"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <ToggleSwitch
                        value={field.value || false}
                        onChange={field.onChange}
                        color="green"
                      />
                    </FormControl>
                    <FormLabel className="">Ngẫu nhiên</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isRequiredAnswer"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <ToggleSwitch
                        value={field.value || false}
                        onChange={field.onChange}
                        color="green"
                      />
                    </FormControl>
                    <FormLabel className="">Câu trả lời bắt buộc</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            {/* Mô tả */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả (Tùy chọn)</FormLabel>
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
            {/* Đáp án - Ẩn khi type = short */}
            {form.watch("type") !== QuestionType.SHORT_ANSWER && (
              <div>
                <div className="mb-2 font-medium">Đáp án</div>
                {/* Thông báo lỗi cho đáp án */}
                <div className="space-y-2">
                  {fields.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`options.${idx}.content` as const}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Checkbox chọn đúng */}
                      <FormField
                        control={form.control}
                        name={`options.${idx}.isCorrect` as const}
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-center">
                            <FormControl>
                              <Checkbox
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Xóa đáp án */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(idx)}
                      >
                        <Trash size={24} color="#637381" />
                      </Button>
                    </div>
                  ))}
                  {form.formState.errors.options && (
                    <div className="text-error-main">
                      {form.formState.errors.options.root?.message}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100"
                  onClick={() => append({ content: "", isCorrect: false })}
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="#637381"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Thêm đáp án
                </Button>
              </div>
            )}

            {/* Câu trả lời ngắn - Chỉ hiện khi type = short */}
            {form.watch("type") === QuestionType.SHORT_ANSWER && (
              <div>
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đáp án đúng</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập đáp án đúng cho câu hỏi này..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Thông báo lỗi cho câu trả lời ngắn */}
                {form.formState.errors.answer && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Câu trả lời ngắn không được để trống
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            {/* Giải thích đáp án đúng */}
            <FormField
              control={form.control}
              name="correctExplanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giải thích đáp án đúng</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Viết gì đó..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Gợi ý đáp án sai */}
            <FormField
              control={form.control}
              name="incorrectHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gợi ý đáp án sai</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Viết gì đó..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Footer */}
            <div className="flex justify-between gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Quay lại
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="text-[#E53935]"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Lưu & Tiếp tục
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}