import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import IconDownload from "../../../../public/icons/lessson/IconDownload";
import IconUpload from "../../../../public/icons/lessson/IconUpload";
import IconNoti from "../../../../public/icons/lessson/IconNoti";
import CKEditorWrapper from "@/components/courses/editor/CKEditorWrapper";
import {
  useSubmitPracticeFile,
  useSubmitPracticeWriting,
} from "@/hooks/queries/tracking/useTracking";
import { useUploadFile } from "@/hooks/queries/course/useUploadFile";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CloseCircle, TickCircle } from "iconsax-react";

// Interface for tracking data
interface FileSubmission {
  submittedAt: string;
  isPassed: boolean;
  fileUrl: string;
  fileName: string;
  score: number | null;
  comment: string | null;
}

interface WritingSubmission {
  submittedAt: string;
  isPassed: boolean;
  content: string;
  score: number | null;
  comment: string | null;
}

interface ExerciseTrackingData {
  lessonId: string;
  submissionType: "upload_file" | "writing" | "code";
  status?: "overview" | "submit-active" | "submit-not-active";
  code: any[];
  file?: FileSubmission;
  writing?: WritingSubmission;
}

export interface IStepsExercise2Props {
  changeTab: (tab: string) => void;
  dataCourse: any;
  dataLesson: any;
  dataTracking: ExerciseTrackingData | null;
}

export default function StepsExercise2({
  dataLesson,
  dataCourse,
  changeTab,
  dataTracking,
}: IStepsExercise2Props) {
  const [fileData, setFileData] = useState<{
    fileUrl: string;
    fileName: string;
  } | null>(null);
  const [writingContent, setWritingContent] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if we're in history mode
  const isHistoryMode = useMemo(() => {
    if (!dataTracking) return false;

    if (dataLesson?.practiceType === "upload_file") {
      return !!(dataTracking.file && dataTracking.file.submittedAt);
    } else {
      return !!(dataTracking.writing && dataTracking.writing.submittedAt);
    }
  }, [dataTracking, dataLesson?.practiceType]);

  const currentSubmission = useMemo(() => {
    if (!isHistoryMode || !dataTracking) return null;

    return dataLesson?.practiceType === "upload_file"
      ? dataTracking.file
      : dataTracking.writing;
  }, [isHistoryMode, dataTracking, dataLesson?.practiceType]);

  // Load history data when in history mode
  useEffect(() => {
    if (isHistoryMode && currentSubmission) {
      if (dataLesson?.practiceType === "upload_file" && dataTracking?.file) {
        // Load file submission history
        setFileData({
          fileUrl: dataTracking.file.fileUrl,
          fileName: dataTracking.file.fileName,
        });
        // Create a mock file object for display
        setUploadedFile({
          name: dataTracking.file.fileName,
          size: 0, // We don't have size info from history
        } as File);
      } else if (
        dataLesson?.practiceType !== "upload_file" &&
        dataTracking?.writing
      ) {
        // Load writing submission history
        setWritingContent(dataTracking.writing.content);
      }
    }
  }, [
    isHistoryMode,
    currentSubmission,
    dataTracking,
    dataLesson?.practiceType,
  ]);

  const submitPracticeWriting = useSubmitPracticeWriting(
    dataCourse?.id as string,
    dataLesson?.id as string,
  );
  const submitPracticeFile = useSubmitPracticeFile(
    dataCourse?.id as string,
    dataLesson?.id as string,
  );
  const { uploadFile } = useUploadFile();
  const queryClient = useQueryClient();

  const handleUploadFile = (file: File) => {
    if (!file || isHistoryMode) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    uploadFile.mutate(formData, {
      onSuccess: (response) => {
        setFileData({
          fileUrl: response.url,
          fileName: file.name,
        });
        setUploadedFile(file);
        setIsUploading(false);
      },
      onError: (error) => {
        console.error("Error uploading file:", error);
        setIsUploading(false);
        toast.error("Lỗi khi upload file!");
      },
    });
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (isHistoryMode) return; // Don't allow file changes in history mode

    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 10MB!");
        return;
      }

      // Validate file type
      const allowedTypes = [".pdf", ".zip", ".rar"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        toast.error("Chỉ hỗ trợ file PDF, ZIP, RAR!");
        return;
      }

      handleUploadFile(file);
    }
  };

  const handleRemoveFile = () => {
    if (isHistoryMode) return; // Don't allow file removal in history mode

    setFileData(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (isHistoryMode) return; // Don't allow submission in history mode

    if (dataLesson?.practiceType === "upload_file") {
      // Submit file practice
      if (!fileData) {
        toast.error("Vui lòng chọn file để nộp bài!");
        return;
      }

      submitPracticeFile.mutate(fileData, {
        onSuccess: () => {
          // Reset form
          setFileData(null);
          setUploadedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          queryClient.invalidateQueries({
            queryKey: ["PracticeTracking", dataCourse?.id, dataLesson?.id],
          });
          changeTab("stepsExercise1");
        },
        onError: (error: any) => {
          console.error("Error submitting file practice:", error);
          toast.error("Lỗi khi nộp bài!");
        },
      });
    } else {
      // Submit writing practice
      if (!writingContent.trim()) {
        toast.error("Vui lòng nhập nội dung bài viết!");
        return;
      }

      submitPracticeWriting.mutate(
        { content: writingContent },
        {
          onSuccess: () => {
            // Reset form
            setWritingContent("");
            queryClient.invalidateQueries({
              queryKey: ["PracticeTracking", dataCourse?.id, dataLesson?.id],
            });
            changeTab("stepsExercise1");
          },
          onError: (error: any) => {
            console.error("Error submitting writing practice:", error);
            toast.error("Lỗi khi nộp bài!");
          },
        },
      );
    }
  };

  const renderContentTab = (value: string) => {
    switch (value) {
      case "content":
        return (
          <div className="w-full">
            <div>
              <div className="font-semibold mb-2">{dataLesson?.title}</div>
              <p className="text-gray-700">{dataLesson?.description}</p>
            </div>
          </div>
        );
      case "download":
        return (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <IconDownload />
              <div className="text-[#1D7BF5]">File video.mp4</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Score styling
  const scoreColor = currentSubmission?.isPassed ? "green" : "red";
  const scoreBg = scoreColor === "green" ? "bg-green-50" : "bg-red-50";
  const scoreText = scoreColor === "green" ? "text-green-600" : "text-red-600";
  const scoreBorder =
    scoreColor === "green" ? "border-green-200" : "border-red-200";

  return (
    <div className="flex flex-col items-center py-10 overflow-hidden">
      <div className="w-full max-w-2xl">
        {/* Header info */}
        <div className="text-xl font-bold">{dataLesson?.title}</div>
        <div className="flex gap-3">
          <div className="text-sm text-[#637381]">
            Bạn cần ít nhất {dataLesson?.passingScore}% điểm để vượt qua.
          </div>
        </div>

        {/* Results - Show when in history mode */}
        {isHistoryMode && currentSubmission && (
          <div
            className={`flex items-center justify-between px-6 py-4 mt-6 mb-4 rounded-xl border ${scoreBorder} ${scoreBg} shadow-sm`}
          >
            <div>
              <div className={`font-semibold text-lg`}>
                Điểm lịch sử:{" "}
                <span className={`font-bold text-2xl ${scoreText}`}>
                  {currentSubmission.score ?? "--"}/100
                </span>
                <span className={`text-sm ml-2 ${scoreText}`}>
                  (
                  {currentSubmission.score
                    ? `${currentSubmission.score}%`
                    : "Chưa chấm"}
                  )
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Thời gian nộp bài:{" "}
                {new Date(currentSubmission.submittedAt).toLocaleString(
                  "vi-VN",
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentSubmission.isPassed ? (
                <TickCircle
                  size={36}
                  className="text-green-500"
                  variant="Bold"
                />
              ) : (
                <CloseCircle
                  size={36}
                  className="text-red-500"
                  variant="Bold"
                />
              )}
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-xl">
                Xem lịch sử
              </div>
            </div>
          </div>
        )}

        <div className="p-4 md:p-6 bg-white border border-gray-200 rounded-2xl mt-10">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="content">Nội dung</TabsTrigger>
              <TabsTrigger value="download">Tải xuống</TabsTrigger>
            </TabsList>
            <TabsContent
              value="content"
              className="mt-4 md:mt-6 text-sm md:text-base"
            >
              {renderContentTab("content")}
            </TabsContent>
            <TabsContent
              value="download"
              className="mt-4 md:mt-6 text-sm md:text-base"
            >
              {renderContentTab("download")}
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 bg-white border border-gray-200 rounded-2xl">
          <div className="p-6 border-b border-b-gray-200 text-lg font-semibold">
            {isHistoryMode ? "Bài tập đã nộp" : "Nộp bài tập"}
          </div>
          <div className="p-6">
            <div className="font-semibold text-sm">
              {isHistoryMode ? "Nội dung đã nộp" : "Nhập câu trả lời của bạn"}
            </div>
            {dataLesson?.practiceType === "upload_file" ? (
              <>
                <div
                  className={`bg-[#919EAB14] border border-dashed border-[#919EAB52] p-10 rounded-xl mt-3 flex flex-col items-center transition-colors ${
                    isHistoryMode
                      ? "cursor-default"
                      : "cursor-pointer hover:border-[#919EAB]"
                  }`}
                  onClick={
                    !isHistoryMode
                      ? () => fileInputRef.current?.click()
                      : undefined
                  }
                >
                  {!uploadedFile ? (
                    <>
                      <IconUpload />
                      <div className="mt-6 font-semibold mb-2">
                        Thả hoặc chọn tệp tin
                      </div>
                      <span>
                        Thả tệp tin vào đây hoặc nhấp để{" "}
                        <span className="underline text-blue-600 cursor-pointer">
                          duyệt
                        </span>{" "}
                        từ máy tính
                      </span>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-gray-700 mb-2 font-medium">
                        📎 {uploadedFile.name}
                      </div>
                      {isHistoryMode && currentSubmission && (
                        <>
                          <div className="text-xs text-gray-500 mb-2">
                            Nộp lúc:{" "}
                            {new Date(
                              currentSubmission.submittedAt,
                            ).toLocaleString("vi-VN")}
                          </div>
                          <a
                            href={fileData?.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            Xem file
                          </a>
                        </>
                      )}
                      {!isHistoryMode && (
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
                          }}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                  )}
                  {!isHistoryMode && (
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      accept=".pdf,.zip,.rar"
                      className="hidden"
                    />
                  )}
                </div>
                <span className="flex items-center gap-2 text-[#637381] mt-3">
                  <IconNoti />
                  <span className="font-semibold text-primary">
                    Kích thước:
                  </span>
                  10 MB,{" "}
                  <span className="font-semibold text-primary">
                    Hỗ trợ tệp:
                  </span>{" "}
                  PDF, ZIP, RAR
                </span>
              </>
            ) : (
              <div className="mt-6">
                <CKEditorWrapper
                  placeholder={
                    isHistoryMode ? "Nội dung đã nộp..." : "Viết gì đó..."
                  }
                  value={writingContent}
                  onChange={(data: string) => {
                    if (isHistoryMode) {
                      return;
                    } else {
                      setWritingContent(data);
                    }
                  }}
                  disabled={isHistoryMode}
                />
                {isHistoryMode && currentSubmission && (
                  <div className="text-xs text-gray-500 mt-2">
                    Nộp lúc:{" "}
                    {new Date(currentSubmission.submittedAt).toLocaleString(
                      "vi-VN",
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Show comment if available */}
            {isHistoryMode && currentSubmission?.comment && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm font-semibold text-yellow-800 mb-2">
                  💬 Nhận xét từ giáo viên:
                </div>
                <div className="text-sm text-yellow-700">
                  {currentSubmission.comment}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-10">
          {isHistoryMode ? (
            <Button
              onClick={() => changeTab("stepsExercise1")}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 transition"
            >
              Trở lại
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={
                isUploading ||
                submitPracticeFile.isPending ||
                submitPracticeWriting.isPending ||
                (dataLesson?.practiceType === "upload_file" && !fileData) ||
                (dataLesson?.practiceType !== "upload_file" &&
                  !writingContent.trim())
              }
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 transition disabled:opacity-60"
            >
              {isUploading ||
              submitPracticeFile.isPending ||
              submitPracticeWriting.isPending
                ? "Đang xử lý..."
                : "Nộp bài"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
