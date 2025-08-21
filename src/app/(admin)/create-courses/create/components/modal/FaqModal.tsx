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
import { z } from "zod";
import { useCreateFAQ } from "@/hooks/queries/course/useFaqs";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";

// Schema validation cho form FAQ
const faqSchema = z.object({
  question: z.string().min(1, "Câu hỏi không được để trống"),
  answer: z.string().min(1, "Câu trả lời không được để trống"),
});

type FaqFormData = z.infer<typeof faqSchema>;

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const FaqModal = ({ isOpen, onClose }: FaqModalProps) => {
  const form = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });
  const { courseData } = useCreateCourseContext();

  const createFaq = useCreateFAQ(courseData?.id as string);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (value: FaqFormData) => {
    createFaq.mutate(value);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-white p-0 rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 border-b border-[#919EAB52] text-left">
          <DialogTitle className="text-lg text-left font-medium text-gray-900">
            Thêm câu hỏi thường gặp
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="p-6 space-y-5"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {/* Câu hỏi */}
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Câu hỏi</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập câu hỏi..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Câu trả lời */}
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Câu trả lời</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập câu trả lời..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="mr-2"
              >
                Hủy
              </Button>
              <Button type="submit" className="text-white">
                Thêm FAQ
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
