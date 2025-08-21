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
import { FormProvider, useForm } from "react-hook-form";
import {
  ModuleCourseFormData,
  moduleCourseSchema,
} from "@/app/(admin)/create-courses/create/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateCourseContext } from "@/context/CreateCourseProvider";
import {
  useCreateModule,
  useUpdateModule,
} from "@/hooks/queries/course/useModuleCourse";
import { useEffect } from "react";

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChapter: () => void;
}

export default function AddChapterModal({
  isOpen,
  onClose,
  onAddChapter,
}: AddChapterModalProps) {
  const { moduleSelected, courseData } = useCreateCourseContext();
  const isEdit = Boolean(moduleSelected?.id);
  const createModule = useCreateModule(courseData?.id as string);
  const updateModule = useUpdateModule(
    courseData?.id as string,
    moduleSelected?.id as string,
  );
  const form = useForm<ModuleCourseFormData>({
    resolver: zodResolver(moduleCourseSchema),
    defaultValues: {
      title: moduleSelected?.title || "",
      shortDescription: moduleSelected?.shortDescription || "",
    },
  });

  useEffect(() => {
    if (moduleSelected) {
      form.reset(moduleSelected);
    } else {
      form.reset({
        title: "",
        shortDescription: "",
      });
    }
  }, [moduleSelected]);

  const onSubmit = (value: ModuleCourseFormData) => {
    if (isEdit) {
      updateModule.mutate(value, {
        onSuccess: () => {
          onAddChapter();
          handleClose();
        },
        onError: (error) => {
          console.error("Error updating chapter:", error);
        },
      });
      return;
    }
    createModule.mutate(value, {
      onSuccess: () => {
        onAddChapter();
        handleClose();
      },
      onError: (error) => {
        console.error("Error creating chapter:", error);
      },
    });
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[580px] bg-white p-0 rounded-lg">
        <DialogHeader className="p-6 pb-4 border-b border-[#919EAB52] text-left">
          <DialogTitle className="text-lg text-left font-medium text-gray-900">
            Thêm chủ đề
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="p-6 space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Tiêu đề
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tiêu đề"
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Giới thiệu
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tóm tắt"
                        className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 py-4 flex justify-end space-x-3 rounded-b-lg border-t border-[#919EAB52]">
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}