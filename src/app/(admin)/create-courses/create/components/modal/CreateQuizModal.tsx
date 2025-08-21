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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Edit, InfoCircle } from "iconsax-react";
import QuizQuestionModal, {
  QuestionFormData,
  QuestionType,
} from "./QuizQuestionModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ToggleSwitch from "../ToggleSwitch";
import {
  useCreateLessonQuiz,
  useGetLessonById,
  useUpdateLessonQuiz,
} from "@/hooks/queries/course/useLessonCourse";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const quizSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().min(1, "Tóm tắt không được để trống"),
});
type QuizFormData = z.infer<typeof quizSchema>;

const settingsSchema = z.object({
  duration: z.number().optional().nullable(),
  durationUnit: z.string().optional().nullable(),
  isViewTimeLimit: z.boolean(),
  feedbackMode: z.enum(["default", "show", "retry"]),
  passingScore: z.number().optional().nullable(),
  maxAttempts: z.number().optional().nullable(),
  autoStart: z.boolean(),
  showQuestionCount: z.boolean(),
  questionLayout: z.enum(["random", "categorized", "ascending", "descending"]),
  questionViewMode: z.enum(["single", "paginated", "scrollable"]),
  shortAnswerCharLimit: z.number().optional().nullable(),
  essayCharLimit: z.number().optional().nullable(),
});
type SettingsFormData = z.infer<typeof settingsSchema>;

export const CreateQuizModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateQuizModalProps) => {
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<QuestionFormData[]>([]);
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { courseData, moduleSelected, lessonSelected } =
    useCreateCourseContext();
  const isEdit = Boolean(lessonSelected?.id);
  const { data: initValue, refetch } = useGetLessonById(
    courseData?.id as string,
    moduleSelected?.id as string,
    lessonSelected?.id as string,
  );
  // Đảm bảo chỉ truyền id khi đã có courseData và module
  const createLessonQuiz = useCreateLessonQuiz(
    courseData?.id || "",
    moduleSelected?.id || "",
  );

  const updateLessonQuiz = useUpdateLessonQuiz(
    courseData?.id || "",
    moduleSelected?.id || "",
    lessonSelected?.id || "",
  );
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const settingsForm = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      duration: undefined,
      durationUnit: "second",
      isViewTimeLimit: false,
      feedbackMode: "default",
      passingScore: undefined,
      maxAttempts: undefined,
      autoStart: false,
      showQuestionCount: false,
      questionLayout: "random",
      questionViewMode: "single",
      shortAnswerCharLimit: 200,
      essayCharLimit: 500,
    },
  });

  const steps = [
    { label: "Bài kiểm tra" },
    { label: "Câu hỏi" },
    { label: "Cài đặt" },
  ];

  useEffect(() => {
    // Reset step and forms when modal opens
    if (lessonSelected) {
      setStep(1);
      form.reset(initValue);
      settingsForm.reset(initValue);
      setQuestions(initValue?.questions || []);
    } else {
      form.reset();
      settingsForm.reset({
        duration: undefined,
        durationUnit: "second",
        isViewTimeLimit: false,
        feedbackMode: "default",
        passingScore: undefined,
        maxAttempts: undefined,
        autoStart: false,
        showQuestionCount: false,
        questionLayout: "random",
        questionViewMode: "single",
        shortAnswerCharLimit: 200,
        essayCharLimit: 500,
      });
      setQuestions([]);
      setStep(1);
    }
  }, [lessonSelected, initValue, isOpen]);

  console.log("form---", questions);
  console.log("settingsForm---", settingsForm.formState.errors);

  const handleNext = async () => {
    if (step === 1) {
      const valid = await form.trigger();
      if (!valid) return;
    }
    if (step === 3) {
      const valid = await settingsForm.trigger();
      if (valid) {
        handleSubmit();
      }
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleClose = () => {
    setStep(1);
    form.reset();
    settingsForm.reset();
    onClose();
  };

  const handleSubmit = async () => {
    const data = {
      title: form.getValues().title.trim(),
      description: form.getValues().description.trim(),
      isViewTimeLimit: settingsForm.getValues().isViewTimeLimit,
      feedbackMode: settingsForm.getValues().feedbackMode,
      autoStart: settingsForm.getValues().autoStart,
      showQuestionCount: settingsForm.getValues().showQuestionCount,
      questionLayout: settingsForm.getValues().questionLayout,
      questionViewMode: settingsForm.getValues().questionViewMode,
      shortAnswerCharLimit: settingsForm.getValues().shortAnswerCharLimit,
      essayCharLimit: settingsForm.getValues().essayCharLimit,
      duration: Number(settingsForm.getValues().duration),
      timeLimitMin: Number(settingsForm.getValues().duration),
      questions: questions,
      passingScore: Number(settingsForm.getValues().passingScore),
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      maxAttempts: 3,
    } as any;

    if (isEdit) {
      updateLessonQuiz.mutate(data, {
        onSuccess: () => {
          onSubmit();
          refetch();
          handleClose();
        },
      });
      return;
    }

    createLessonQuiz.mutate(data, {
      onSuccess: () => {
        onSubmit();
        handleClose();
      },
    });
  };

  const handleSubmitCreateQuiz = (value: QuestionFormData) => {
    if (editIndex) {
      setQuestions((prev) => {
        const updatedQuestions = [...prev];
        updatedQuestions[editIndex] = value;
        return updatedQuestions;
      });
      setEditIndex(null);
      return;
    }

    setQuestions((prev) => {
      return [...prev, value];
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[60vw] bg-white p-0 rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 border-b border-[#919EAB52] text-left">
          <DialogTitle className="text-lg text-left font-medium text-gray-900">
            Thêm bài kiểm tra
          </DialogTitle>
        </DialogHeader>
        {/* Stepper */}
        <div className="flex items-start px-6 pt-6 pb-2 w-full">
          {steps.map((item, idx) => (
            <>
              <div
                key={item.label}
                className="flex flex-col items-center min-w-[80px]"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-200
                    ${
                      step >= idx + 1
                        ? "border-primary-main bg-primary-main text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }
                  `}
                >
                  {idx + 1}
                </div>
                <span
                  className={`mt-2 text-base transition-all duration-200
                    ${
                      step >= idx + 1
                        ? "text-black font-bold"
                        : "text-gray-400 font-normal"
                    }
                  `}
                >
                  {item.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mt-4 ${step >= idx + 2 ? "bg-primary-main" : "bg-gray-200"}`}
                  style={{ minWidth: 32 }}
                />
              )}
            </>
          ))}
        </div>
        {/* Nội dung từng step */}
        <div className="p-6 space-y-5">
          {step === 1 && (
            <Form {...form}>
              <form className="space-y-5">
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
              </form>
            </Form>
          )}
          {step === 2 && (
            <div className="space-y-3">
              {/* Danh sách câu hỏi */}
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                  >
                    <span className="text-base font-medium text-gray-900">
                      {q.content}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {q.type === QuestionType.SINGLE_CHOICE && "Một đáp án"}
                        {q.type === QuestionType.SHORT_ANSWER &&
                          "Câu trả lời ngắn"}
                        {q.type === QuestionType.MULTIPLE_CHOICE &&
                          "Nhiều đáp án"}
                      </span>
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-gray-100"
                        onClick={() => {
                          setEditIndex(idx);
                          setOpenQuestionModal(true);
                        }}
                      >
                        <Edit color="#637381" size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Nút thêm câu hỏi */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-50 text-gray-900 font-medium text-base mt-2 hover:bg-gray-100 transition"
                onClick={() => {
                  setEditIndex(null);
                  setOpenQuestionModal(true);
                }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#637381"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Thêm câu hỏi
              </button>
              {/* Modal thêm/sửa câu hỏi */}
              <QuizQuestionModal
                isOpen={openQuestionModal}
                onClose={() => setOpenQuestionModal(false)}
                defaultValues={
                  editIndex !== null ? questions[editIndex] : undefined
                }
                onSubmit={(data) => {
                  handleSubmitCreateQuiz(data);
                }}
              />
            </div>
          )}
          {step === 3 && (
            <Form {...settingsForm}>
              <form className="space-y-6">
                {/* Thời gian tối đa */}
                <div>
                  <FormLabel className="mb-2 block">Thời gian tối đa</FormLabel>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <FormField
                      control={settingsForm.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type={"number"}
                              className="flex-1"
                              placeholder="00"
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
                    <FormField
                      control={settingsForm.control}
                      name="durationUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              value={field.value || undefined}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                style={{ marginBlockEnd: 0 }}
                                className="h-12 flex-1 space-y-0"
                              >
                                <SelectValue placeholder="Giây" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="second">Giây</SelectItem>
                                <SelectItem value="minute">Phút</SelectItem>
                                <SelectItem value="hour">Giờ</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={settingsForm.control}
                      name="isViewTimeLimit"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 flex-1">
                          <FormControl>
                            <ToggleSwitch
                              value={field.value}
                              onChange={field.onChange}
                              color="blue"
                            />
                          </FormControl>
                          <span className="text-sm text-gray-600">
                            Ẩn/Hiện thời gian kiểm tra
                          </span>
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <InfoCircle variant="Bold" size={16} color="#637381" />
                    <span className="ml-1">
                      Giới hạn thời gian cho bài kiểm tra này. Đặt 0 để không
                      giới hạn.
                    </span>
                  </p>
                </div>
                {/* Chế độ phân chia câu hỏi */}
                <FormField
                  control={settingsForm.control}
                  name="feedbackMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1 block">
                        Chế độ phản hồi câu hỏi
                      </FormLabel>
                      <div className="mt-1 text-[#637381] text-xs">
                        (Chọn hành vi của hệ thống câu đố dựa trên các câu hỏi
                        lựa chọn.)
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="default"
                            checked={field.value === "default"}
                            onChange={() => field.onChange("default")}
                            className="accent-blue-600"
                          />
                          <span className="font-medium text-xs">Mặc định</span>
                          <span className="text-xs text-gray-500">
                            (Câu trả lời được hiển thị sau khi bài kiểm tra kết
                            thúc)
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="show"
                            checked={field.value === "show"}
                            onChange={() => field.onChange("show")}
                            className="accent-blue-600"
                          />
                          <span className="font-medium text-xs">
                            Chế độ hiển thị
                          </span>
                          <span className="text-xs text-gray-500">
                            (Hiển thị kết quả sau khi thử)
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="retry"
                            checked={field.value === "retry"}
                            onChange={() => field.onChange("retry")}
                            className="accent-blue-600"
                          />
                          <span className="font-medium text-xs">
                            Chế độ thi lại
                          </span>
                          <span className="text-xs text-gray-500">
                            (Thí sinh trả bài kiểm tra bất kỳ số lần nào. Định
                            nghĩa số lần thử được phép bên dưới)
                          </span>
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Điểm đạt */}
                <FormField
                  control={settingsForm.control}
                  name="passingScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1 block">Điểm đạt (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="flex-1"
                          placeholder="50"
                          {...field}
                          value={field.value || undefined}
                          onChange={(event) => {
                            field.onChange(Number(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#637381" />
                        <span className="ml-1">Đặt 0 để không giới hạn.</span>
                      </p>
                    </FormItem>
                  )}
                />
                {/* Số lần trả lời cho phép */}
                <FormField
                  control={settingsForm.control}
                  name="maxAttempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-1 block">
                        Câu hỏi tối đa được phép trả lời
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="flex-1"
                          placeholder="10"
                          {...field}
                          value={field.value || undefined}
                          onChange={(event) => {
                            field.onChange(Number(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <InfoCircle variant="Bold" size={16} color="#637381" />
                        <span className="ml-1">
                          Số lượng câu hỏi sẽ có sẵn để học sinh trả lời và câu
                          hỏi sẽ được chọn ngẫu nhiên từ tất cả các câu hỏi có
                          sẵn trong bài kiểm tra. Nếu số lượng này lớn hơn số
                          câu hỏi có sẵn, học sinh có thể trả lời mọi câu hỏi.
                        </span>
                      </p>
                    </FormItem>
                  )}
                />
                {/* Accordion nâng cao */}
                <Accordion type="single" collapsible className="rounded-lg">
                  <AccordionItem value="advanced">
                    <AccordionTrigger className="px-4 py-3 font-semibold">
                      Cài đặt nâng cao
                    </AccordionTrigger>
                    <AccordionContent className="space-y-8 px-4 pb-4">
                      <FormField
                        control={settingsForm.control}
                        name="autoStart"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <ToggleSwitch
                                value={field.value}
                                onChange={field.onChange}
                                color="blue"
                              />
                            </FormControl>
                            <span className="text-sm">
                              Tự động bắt đầu kiểm tra
                            </span>
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={settingsForm.control}
                          name="questionLayout"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bố cục câu hỏi</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Ngẫu nhiên" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="random">
                                      Ngẫu nhiên
                                    </SelectItem>
                                    <SelectItem value="categorized">
                                      Theo chủ đề
                                    </SelectItem>
                                    <SelectItem value="ascending">
                                      Tăng dần
                                    </SelectItem>
                                    <SelectItem value="descending">
                                      Giảm dần
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={settingsForm.control}
                          name="questionViewMode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cài đặt câu hỏi</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Đặt chế độ xem bố cục câu hỏi" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="paginated">
                                      Theo số trang
                                    </SelectItem>
                                    <SelectItem value="single">
                                      Xem từng câu
                                    </SelectItem>
                                    <SelectItem value="scrollable">
                                      Cuộn từng câu
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={settingsForm.control}
                        name="showQuestionCount"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <ToggleSwitch
                                value={field.value}
                                onChange={field.onChange}
                                color="blue"
                              />
                            </FormControl>
                            <span className="text-sm">
                              Ngẫu nhiên số câu hỏi khi làm bài
                            </span>
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={settingsForm.control}
                          name="shortAnswerCharLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giới hạn ký tự trả lời ngắn</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="200"
                                  {...field}
                                  value={field.value || undefined}
                                  onChange={(event) => {
                                    field.onChange(Number(event.target.value));
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={settingsForm.control}
                          name="essayCharLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Giới hạn ký tự trả lời câu hỏi mở/Bình luận
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="500"
                                  {...field}
                                  value={field.value || undefined}
                                  onChange={(event) => {
                                    field.onChange(Number(event.target.value));
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </form>
            </Form>
          )}
        </div>
        <DialogFooter className="px-6 py-4 flex justify-between space-x-3 rounded-b-lg border-t border-[#919EAB52]">
          {/* Bên trái: Quay lại */}
          <div>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
                className="text-primary-contrastText border-[#919EAB52]"
              >
                Quay lại
              </Button>
            )}
          </div>
          {/* Bên phải: Huỷ bỏ & Lưu & Tiếp tục */}
          <div className="flex gap-4 items-end">
            <Button
              type="button"
              size="sm"
              onClick={handleClose}
              className="bg-[#FFF1F1] hover:bg-[#FEE2E2] text-[#E53935]"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Lưu & Tiếp tục
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};