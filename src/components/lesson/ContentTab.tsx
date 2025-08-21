import IconWarning from "../../../public/icons/IconWarning";
import IconStar from "../../../public/icons/IconStar";
import { Plus } from "lucide-react";
import IconEditLesson from "../../../public/icons/lessson/IconEditLesson";
import IconTrashLesson from "../../../public/icons/lessson/IconTrashLesson";
import IconDownload from "../../../public/icons/lessson/IconDownload";
import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatToHourUnit,
  formatToVietnameseMonthYear,
} from "@/until";
import {
  useNote,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/queries/course/useCourses";
import toast from "react-hot-toast";

export interface ContentTabProps {
  courseTitle: string;
  currentLesson: any;
  lessonId?: string;
  courseId?: string;
  dataLesson?: any;
}

export default function ContentTab(props: ContentTabProps) {
  const { courseTitle, currentLesson, lessonId, courseId, dataLesson } = props;
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: noteData } = useNote(courseId as string, lessonId as string);
  const createNoteMutation = useCreateNote(
    courseId as string,
    lessonId as string,
  );
  const updateNoteMutation = useUpdateNote(
    courseId as string,
    lessonId as string,
  );
  const deleteNoteMutation = useDeleteNote(
    courseId as string,
    lessonId as string,
  );

  async function autoDownload(url: string, filename?: string) {
    const loadingToastId = toast.loading("Đang tải file...");
    
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      // Method 1: Try using our proxy API first (Best for CORS + Auth)
      try {
        const proxyResponse = await fetch('/api/download-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ url, filename })
        });

        if (proxyResponse.ok) {
          const blob = await proxyResponse.blob();
          
          // Force download using blob URL
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.style.display = "none";
          
          // Get filename from response headers or use provided
          let downloadFilename = filename;
          const contentDisposition = proxyResponse.headers.get('content-disposition');
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
            if (filenameMatch && filenameMatch[1]) {
              downloadFilename = filenameMatch[1];
            }
          }
          
          if (!downloadFilename) {
            downloadFilename = url.split("/").pop()?.split("?")[0] || "download";
          }
          
          a.download = decodeURIComponent(downloadFilename);
          document.body.appendChild(a);
          a.click();
          
          // Cleanup
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
          }, 100);
          
          toast.dismiss(loadingToastId);
          toast.success(`Đã tải xuống: ${downloadFilename}`);
          return;
        }
      } catch (proxyError) {
        console.log("Proxy download failed:", proxyError);
      }

      // Method 2: Direct fetch with CORS (if allowed)
      try {
        const directResponse = await fetch(url, {
          method: 'GET',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          mode: 'cors'
        });
        
        if (directResponse.ok) {
          const blob = await directResponse.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          
          const a = document.createElement("a");
          a.href = blobUrl;
          a.style.display = "none";
          a.download = filename || url.split("/").pop()?.split("?")[0] || "download";
          
          document.body.appendChild(a);
          a.click();
          
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
          }, 100);
          
          toast.dismiss(loadingToastId);
          toast.success(`Đã tải xuống: ${a.download}`);
          return;
        }
      } catch (directError) {
        console.log("Direct download failed:", directError);
      }

      // Method 3: Force download using iframe trick
      try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 5000);
        
        toast.dismiss(loadingToastId);
        toast.success("Đã khởi tạo tải file!");
        return;
      } catch (iframeError) {
        console.log("Iframe download failed:", iframeError);
      }

      // Method 4: Final fallback with forced download attribute
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || url.split("/").pop()?.split("?")[0] || "download";
      link.style.display = "none";
      
      // Force download instead of opening
      link.setAttribute('target', '_self');
      link.setAttribute('rel', 'noopener');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss(loadingToastId);
      toast.success("Đã khởi tạo tải file!");
      
    } catch (error) {
      console.error("Lỗi khi tải file:", error);
      toast.dismiss(loadingToastId);
      toast.error("Không thể tải file. Vui lòng thử lại!");
    }
  }


  // Helper to get file extension from content type or URL
  const getFileExtension = (url: string, contentType?: string): string => {
    // Try to get extension from URL first
    const urlExt = url.split('.').pop()?.toLowerCase();
    if (urlExt && ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', 'mp4', 'mp3', 'jpg', 'jpeg', 'png', 'gif'].includes(urlExt)) {
      return urlExt;
    }
    
    // Fallback to content type mapping
    const typeMap: Record<string, string> = {
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
      'application/zip': 'zip',
      'application/x-rar-compressed': 'rar',
      'video/mp4': 'mp4',
      'audio/mpeg': 'mp3',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
    };
    
    return contentType ? typeMap[contentType] || 'file' : 'file';
  };

  console.log(dataLesson, "---dataLesson");

  // Map noteData to display format
  const notes = useMemo(() => {
    if (!noteData || !Array.isArray(noteData)) return [];

    return noteData.map((note) => ({
      id: note.id,
      section: currentLesson?.title || "Không xác định",
      sub: currentLesson?.title || "Không xác định",
      content: note.content,
      timestamp: note.timestampSec,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));
  }, [noteData, currentLesson?.title]);

  // Thêm ghi chú mới
  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("Vui lòng nhập nội dung ghi chú!");
      return;
    }

    try {
      await createNoteMutation.mutateAsync({
        timestampSec: 1243,
        content: newNote.trim(),
      });
      setNewNote("");
      toast.success("Tạo ghi chú thành công!");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Lỗi khi tạo ghi chú!");
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ghi chú này không?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteNoteMutation.mutateAsync(id);
      toast.success("Xóa ghi chú thành công!");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Lỗi khi xóa ghi chú!");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditNote = (id: string, content: string) => {
    setEditingId(id);
    setEditingContent(content);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingContent.trim()) {
      toast.error("Vui lòng nhập nội dung ghi chú!");
      return;
    }

    try {
      await updateNoteMutation.mutateAsync({
        noteId: id,
        content: editingContent.trim(),
      });
      setEditingId(null);
      setEditingContent("");
      toast.success("Cập nhật ghi chú thành công!");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Lỗi khi cập nhật ghi chú!");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
  };

  const renderContentTab = (value: string) => {
    switch (value) {
      case "overview":
        return (
          <>
            <p className="text-secondary mb-3">
              {currentLesson?.shortDescription}
            </p>
            <div className="flex gap-2 items-center mb-3">
              <IconWarning />
              <div className="text-secondary">
                Cập nhật lần cuối:{" "}
                {currentLesson?.updatedAt
                  ? formatToVietnameseMonthYear(currentLesson?.updatedAt)
                  : "Chưa cập nhật"}
              </div>
            </div>
            <div className="flex gap-8 pb-6 border-b border-dashed border-b-gray-200 mb-4">
              <div>
                <div className="text-primary font-semibold flex items-center gap-1 text-[#FF9800]">
                  {currentLesson?.ratingAvg}
                  <IconStar />
                </div>
                <div className="text-secondary text-xs">
                  {currentLesson?.ratingCnt} Đánh giá
                </div>
              </div>
              <div>
                <div className="text-primary font-semibold">800,664</div>
                <div className="text-secondary text-xs">Học sinh</div>
              </div>
              <div>
                <div className="text-primary font-semibold">
                  {currentLesson?.duration
                    ? formatToHourUnit(currentLesson.duration)
                    : "0"}
                </div>
                <div className="text-secondary text-xs">Tổng</div>
              </div>
              <div>
                <div className="text-primary font-semibold">
                  {currentLesson?.totalLessons}
                </div>
                <div className="text-secondary text-xs">Bài giảng</div>
              </div>
              <div>
                <div className="text-primary font-semibold">Tất cả</div>
                <div className="text-secondary text-xs">Độ khó</div>
              </div>
            </div>
            <div className="text-primary font-semibold mb-4">Mô tả</div>
            <p className="mb-4">{currentLesson?.description}</p>
          </>
        );
      case "notes":
        return (
          <div className="w-full">
            {/* Input tạo ghi chú mới */}
            <div className="mb-6">
              <div className="flex items-center gap-2 relative">
                <input
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Tạo mới ghi chú"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !createNoteMutation.isPending)
                      handleAddNote();
                  }}
                  disabled={createNoteMutation.isPending}
                />
                <button
                  className="bg-[#637381] cursor-pointer absolute right-2 text-white rounded-lg p-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddNote}
                  disabled={createNoteMutation.isPending}
                  aria-label="Thêm ghi chú"
                >
                  {createNoteMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Plus size={20} color="white" />
                  )}
                </button>
              </div>
            </div>
            {/* Danh sách ghi chú */}
            <div className="space-y-6">
              {notes.length === 0 && (
                <div className="text-gray-400 text-center py-8">
                  Chưa có ghi chú nào.
                </div>
              )}
              {notes.map((note) => (
                <div key={note.id} className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <div className="font-semibold text-base mr-2">
                        {note.section}
                      </div>
                      <div className="flex-1 text-xs text-gray-500">
                        {note.sub}
                        {/*{note.timestamp && (*/}
                        {/*  <span className=" ml-2 text-blue-500">*/}
                        {/*    • Thời gian: {formatTimestamp(note.timestamp)}*/}
                        {/*  </span>*/}
                        {/*)}*/}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditNote(note.id, note.content)}
                        disabled={
                          deletingId === note.id ||
                          updateNoteMutation.isPending ||
                          createNoteMutation.isPending
                        }
                        aria-label="Sửa ghi chú"
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <IconEditLesson />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        disabled={
                          deletingId === note.id ||
                          updateNoteMutation.isPending ||
                          createNoteMutation.isPending
                        }
                        aria-label="Xóa ghi chú"
                        className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {deletingId === note.id ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                        ) : (
                          <IconTrashLesson />
                        )}
                      </button>
                    </div>
                  </div>
                  {editingId === note.id ? (
                    <div className="mt-2">
                      <textarea
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleSaveEdit(note.id)}
                          disabled={
                            updateNoteMutation.isPending ||
                            createNoteMutation.isPending
                          }
                        >
                          {updateNoteMutation.isPending ? "Đang lưu..." : "Lưu"}
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleCancelEdit}
                          disabled={
                            updateNoteMutation.isPending ||
                            createNoteMutation.isPending
                          }
                        >
                          Huỷ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg px-4 py-3 mt-2 text-gray-700">
                      {note.content}
                      {note.createdAt && (
                        <div className="text-xs text-gray-400 mt-2">
                          Tạo: {formatToVietnameseMonthYear(note.createdAt)}
                          {note.updatedAt !== note.createdAt && (
                            <span>
                              {" "}
                              • Cập nhật:{" "}
                              {formatToVietnameseMonthYear(note.updatedAt)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case "download":
        return (
          <div>
            {dataLesson?.videoUrl && (
              <div
                onClick={() => {
                  const cleanTitle = dataLesson?.title?.replace(/[^\w\s-]/g, '') || "Video_Bai_Giang";
                  const fileName = `${cleanTitle}.mp4`;
                  autoDownload(dataLesson.videoUrl, fileName);
                }}
                role="presentation"
                className="flex cursor-pointer items-center gap-2 mb-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <IconDownload />
                <div className="text-[#1D7BF5] hover:text-[#1557C3]">
                  📹 {dataLesson?.title || "Video bài giảng"} <span className="text-gray-500 text-sm">(.mp4)</span>
                </div>
              </div>
            )}
            {dataLesson?.attachmentUrl && (
              <div
                onClick={() => {
                  // Use helper to determine file extension
                  const fileExtension = getFileExtension(dataLesson.attachmentUrl);
                  const cleanTitle = dataLesson?.title?.replace(/[^\w\s-]/g, '') || "Tai_lieu_bai_hoc";
                  const fileName = `${cleanTitle}.${fileExtension}`;
                  autoDownload(dataLesson.attachmentUrl, fileName);
                }}
                role="presentation"
                className="flex cursor-pointer items-center gap-2 mb-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <IconDownload />
                <div className="text-[#1D7BF5] hover:text-[#1557C3]">
                  📄 {dataLesson?.title || "Tài liệu bài học"}
                  <span className="text-gray-500 text-sm ml-1">
                    (.{getFileExtension(dataLesson.attachmentUrl)})
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          {dataLesson?.type === "VIDEO" && (
            <TabsTrigger value="notes">Ghi chú</TabsTrigger>
          )}
          {dataLesson?.type === "VIDEO" && (
            <TabsTrigger value="download">Tải xuống</TabsTrigger>
          )}
        </TabsList>
        <TabsContent
          value="overview"
          className="mt-4 md:mt-6 text-sm md:text-base"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
            {courseTitle}
          </h2>
          {renderContentTab("overview")}
        </TabsContent>
        <TabsContent
          value="notes"
          className="mt-4 md:mt-6 text-sm md:text-base"
        >
          {renderContentTab("notes")}
        </TabsContent>
        <TabsContent
          value="download"
          className="mt-4 md:mt-6 text-sm md:text-base"
        >
          {renderContentTab("download")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
