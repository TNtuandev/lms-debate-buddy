import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/text-area";
import React, { useEffect, useRef, useState } from "react";

interface CKEditorWrapperProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Type definitions for CKEditor
interface ErrorDetails {
  phase: string;
  willEditorRestart: boolean;
}

interface CKEditorProps {
  editor: any;
  data: string;
  config: {
    licenseKey: string;
    toolbar: string[];
    placeholder: string;
  };
  onReady?: (editor: any) => void;
  onChange?: (event: any, editor: { getData: () => string }) => void;
  onError?: (error: Error, details: ErrorDetails) => void;
}

type CKEditorComponent = React.ComponentType<CKEditorProps>;

const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  disabled,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<any>(null);
  const CKEditorRef = useRef<CKEditorComponent | null>(null);
  const ClassicEditorRef = useRef<any>(null);

  console.log("CKEditorWrapper disabled ", disabled);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let isMounted = true;

    const loadCKEditor = async () => {
      try {
        console.log("Loading CKEditor...");

        // Dynamic imports
        const [ckeditorReact, classicEditor] = await Promise.all([
          import("@ckeditor/ckeditor5-react"),
          import("@ckeditor/ckeditor5-build-classic"),
        ]);

        if (!isMounted) return;

        CKEditorRef.current =
          ckeditorReact.CKEditor as unknown as CKEditorComponent;
        ClassicEditorRef.current = classicEditor.default;

        console.log("CKEditor loaded successfully");
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error("Failed to load CKEditor:", err);
        if (isMounted) {
          setError("Không thể tải trình soạn thảo");
        }
      }
    };

    loadCKEditor();

    return () => {
      isMounted = false;
    };
  }, [isClient]);

  const handleRetry = () => {
    setError(null);
    setIsLoaded(false);

    const retryLoad = async () => {
      try {
        const [ckeditorReact, classicEditor] = await Promise.all([
          import("@ckeditor/ckeditor5-react"),
          import("@ckeditor/ckeditor5-build-classic"),
        ]);

        CKEditorRef.current =
          ckeditorReact.CKEditor as unknown as CKEditorComponent;
        ClassicEditorRef.current = classicEditor.default;
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error("Retry failed:", err);
        setError("Vẫn không thể tải trình soạn thảo");
      }
    };

    retryLoad();
  };

  if (!isClient) {
    return (
      <div className="border border-gray-300 rounded p-4 text-center">
        <p className="text-sm text-gray-600">Đang khởi tạo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-300 rounded p-4 bg-red-50">
        <p className="text-red-600 mb-2 text-sm">{error}</p>
        <div className="flex gap-2 justify-center mb-4">
          <Button variant="outline" size="sm" onClick={handleRetry}>
            Thử lại
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </Button>
        </div>
        <div>
          <p className="text-xs mb-2 block text-gray-600">
            Sử dụng trình soạn thảo đơn giản:
          </p>
          <Textarea
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onChange(e.target.value)
            }
            rows={8}
            className="w-full"
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  }

  if (!isLoaded || !CKEditorRef.current || !ClassicEditorRef.current) {
    return (
      <div className="border border-gray-300 rounded p-4 text-center">
        <p className="text-sm text-gray-600">Đang tải trình soạn thảo...</p>
        <p className="text-xs mt-2 text-gray-500">Vui lòng đợi...</p>
      </div>
    );
  }

  const CKEditor = CKEditorRef.current;
  const ClassicEditor = ClassicEditorRef.current;

  return (
    <div className="border border-gray-300 rounded">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: "GPL",
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "outdent",
            "indent",
            "|",
            "blockQuote",
            "undo",
            "redo",
          ],
          placeholder: placeholder,
        }}
        onReady={(editor: any) => {
          console.log("Editor is ready!", editor);
          editorRef.current = editor;
        }}
        onChange={(event: any, editor: { getData: () => string }) => {
          try {
            const data = editor.getData();
            onChange(data);
          } catch (err) {
            console.error("Error getting editor data:", err);
          }
        }}
        onError={(error: Error, details: ErrorDetails) => {
          console.error("CKEditor error:", error);
          if (!details.willEditorRestart) {
            setError("Có lỗi xảy ra với trình soạn thảo");
          }
        }}
      />
    </div>
  );
};

export default CKEditorWrapper;
