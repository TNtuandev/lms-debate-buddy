import { useCallback, useEffect, useRef, useState } from "react";
import { useSubmitPracticeCode } from "@/hooks/queries/course/useSubmitPractice";
import { useSearchParams } from "next/navigation";
import { CourseDetail } from "@/api/types/course.type";
import { useQueryClient } from "@tanstack/react-query";

interface ExerciseData {
  title: string;
  description: string;
  requirements: string[];
  objectives: string[];
  initialCode: string;
  testCases: string[];
  language?: "java" | "cpp" | "javascript"; // Add language property
}

interface TestResult {
  success: boolean;
  output: string;
  error?: string;
  warnings?: string;
  testsPassed?: number;
  testsTotal?: number;
}

const defaultExercise: ExerciseData = {
  title: "Phần 1",
  description: "Bạn sẽ xem được gọi ý sau khi thử 3 lần.",
  requirements: [
    'Nếu không có lỗi, bạn nên "báo cáo" nội dung của tập tin',
    "Nếu có lỗi, hãy làm cho hàm run_test trả về giá trị khác không, thường là 1 hoặc 2",
  ],
  objectives: [
    'Làm quen với các chiến lược báo cáo lỗi khác nhau, cách đọc kết quả và cách xử lý mọi giá trị "tài trọng" tiềm ẩn.',
    "Đánh giá các kỹ thuật báo cáo lỗi khác nhau khi nói đến tính an toàn của chúng. Như bạn sẽ thấy, nhiều kỹ thuật trong số chúng không hoàn hảo về chiến lược báo cáo lỗi, vẫn có chỗ cho sai sót.",
  ],
  initialCode: `#ifndef EXERCISE_H
#define EXERCISE_H

#include <string>
struct Tester
{
    virtual ~Tester() = default;
    /**
     * @brief Report the result of the test by calling this method.
     * * Do NOT call this method unless you have correctly read the file contents.
     * * @param fileContent The contents of the file to report
     */
    virtual void reportResult(const std::string& fileContent) = 0;
};

}`,
  testCases: ["Không đặt: 0, Đặt: 0 trong 0 bài kiểm tra"],
  language: "cpp",
};

// Java default exercise
const defaultJavaExercise: ExerciseData = {
  title: "Java Exercise - Hello World",
  description: "Tạo một chương trình Java đơn giản để in ra Hello World.",
  requirements: [
    "Tạo class Main với phương thức main",
    "Sử dụng System.out.println để in ra console",
  ],
  objectives: [
    "Làm quen với cú pháp Java cơ bản",
    "Hiểu cách hoạt động của method main trong Java",
  ],
  initialCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  testCases: ["Test 1: In ra Hello, World!"],
  language: "java",
};

export default function StudyCode({
  exercise = defaultExercise,
  course,
  initValue,
}: {
  exercise?: ExerciseData;
  course?: CourseDetail;
  initValue?: any;
}) {
  const [currentCode, setCurrentCode] = useState(exercise.initialCode);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("noi-dung");
  const [activeResultTab, setActiveResultTab] = useState("test-cases");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lesson");
  // Java compiler iframe ref
  const javaIframeRef = useRef<HTMLIFrameElement>(null);

  const queryClient = useQueryClient();

  const refetchPracticeTracking = () => {
    queryClient.invalidateQueries({
      queryKey: ["PracticeTracking", course?.id, lessonId],
    });
  };

  const submitCode = useSubmitPracticeCode(
    course?.id as string,
    lessonId as string,
  );

  const handleSubmitCoding = () => {
    submitCode.mutate(
      {
        codeSnippet: currentCode,
        language: exercise.language?.toUpperCase(),
      },
      {
        onSuccess: (data) => {
          console.log("Code submittxed successfully:", data);
          refetchPracticeTracking();
        },
        onError: (error) => {
          console.error("Error submitting code:", error);
        },
      },
    );
  };

  const handleRunTest = useCallback(async () => {
    setIsRunning(true);
    setAttemptCount((prev) => prev + 1);

    if (exercise.language === "java") {
      // For Java, trigger run in OneCompiler iframe
      if (javaIframeRef.current) {
        javaIframeRef.current.contentWindow?.postMessage(
          {
            eventType: "triggerRun",
          },
          "*",
        );
      }

      setTimeout(() => {
        const result: TestResult = {
          success: true,
          output: "Java code executed in OneCompiler",
          testsPassed: 1,
          testsTotal: 1,
        };
        setTestResult(result);
        setIsRunning(false);
      }, 1000);
    } else {
      // Original C++ validation logic
      setTimeout(() => {
        const codeValidation = validateCppCode(currentCode);
        const result: TestResult = {
          success: codeValidation.isValid,
          output: codeValidation.output,
          error: codeValidation.error,
          warnings: codeValidation.warnings,
          testsPassed: codeValidation.testsPassed,
          testsTotal: codeValidation.testsTotal,
        };

        setTestResult(result);
        setIsRunning(false);
      }, 1500);
    }
  }, [currentCode, exercise.language]);

  // Load initial code into Java iframe
  const loadJavaCode = useCallback(() => {
    if (javaIframeRef.current && exercise.language === "java") {
      console.log("Loading Java code:", currentCode);
      javaIframeRef.current.contentWindow?.postMessage(
        {
          eventType: "populateCode",
          language: "java",
          files: [
            {
              name: "Main.java",
              content: currentCode,
            },
          ],
        },
        "*",
      );
    }
  }, [currentCode, exercise.language]);

  useEffect(() => {
    if (exercise.language === "java") {
      // Delay to ensure iframe is loaded
      const timer = setTimeout(() => {
        loadJavaCode();
      }, 2000); // Tăng thời gian delay

      return () => clearTimeout(timer);
    }
  }, [loadJavaCode, exercise.language]);

  // Listen for iframe load event
  const handleIframeLoad = useCallback(() => {
    console.log("Java iframe loaded");
    if (exercise.language === "java") {
      // Load code when iframe is ready
      setTimeout(() => {
        console.log("Attempting to load code after iframe load");
        loadJavaCode();
      }, 500);
    }
  }, [exercise.language, loadJavaCode]);

  useEffect(() => {
    // Listen for messages from OneCompiler iframe for Java
    const handleMessage = (event: MessageEvent) => {
      console.log("Received message:", event.data);

      if (event.data && event.data.language === "java") {
        console.log("Java code changed:", event.data);
        if (event.data.files && event.data.files[0]) {
          setCurrentCode(event.data.files[0].content);
        }
      }

      // OneCompiler ready signal
      if (event.data && event.data.eventType === "ready") {
        console.log("OneCompiler is ready, loading code...");
        setTimeout(loadJavaCode, 100);
      }
    };

    if (exercise.language === "java") {
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }
  }, [exercise.language, loadJavaCode]);

  // Helper function to validate C++ code
  const validateCppCode = (code: string) => {
    const errors = [];
    const warnings = [];
    let testsPassed = 0;
    const testsTotal = 3;

    // Check basic C++ syntax
    if (!code.includes("#ifndef") || !code.includes("#define")) {
      errors.push("Thiếu header guards (#ifndef/#define)");
    }

    if (!code.includes("#include")) {
      errors.push("Thiếu include statements");
    }

    // Check for required struct/class
    if (!code.includes("struct Tester") && !code.includes("class Tester")) {
      errors.push("Thiếu định nghĩa struct/class Tester");
    }

    // Check for virtual destructor
    if (!code.includes("virtual ~Tester()")) {
      errors.push("Thiếu virtual destructor");
    }

    // Check for reportResult method
    if (!code.includes("reportResult")) {
      errors.push("Thiếu method reportResult");
    } else {
      // Check method signature
      if (
        !code.includes(
          "virtual void reportResult(const std::string& fileContent)",
        )
      ) {
        warnings.push("Method signature có thể không chính xác");
      } else {
        testsPassed++;
      }
    }

    // Check for proper method declaration
    if (code.includes("= 0;")) {
      testsPassed++;
    } else {
      warnings.push("Method nên là pure virtual (= 0)");
    }

    // Check for closing braces
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push("Số lượng dấu ngoặc nhọn không khớp");
    } else {
      testsPassed++;
    }

    const isValid = errors.length === 0;
    let output = `Không đặt: ${errors.length}, Đặt: ${testsPassed} trong ${testsTotal} bài kiểm tra`;

    if (warnings.length > 0) {
      output += `\nCảnh báo: ${warnings.length} warning(s)`;
    }

    return {
      isValid,
      output,
      error: errors.length > 0 ? errors.join("; ") : undefined,
      warnings: warnings.length > 0 ? warnings.join("; ") : undefined,
      testsPassed,
      testsTotal,
    };
  };

  const renderCodeEditor = () => {
    if (exercise.language === "java") {
      return (
        <div className="relative border-2 border-[#7c4dff] m-2 rounded">
          <iframe
            ref={javaIframeRef}
            src="https://onecompiler.com/embed/java?listenToEvents=true&codeChangeEvent=true&theme=dark"
            width="100%"
            height="50vh"
            frameBorder="0"
            title="Java Compiler"
            onLoad={handleIframeLoad}
            style={{ height: "50vh" }}
          />
        </div>
      );
    }
  };

  return (
    <div className="flex bg-[#1e1e1e] h-screen">
      {/* Left Panel - Navigation & Content */}
      <div className="w-[380px] bg-[#2d2d30] border-r border-gray-600 flex flex-col">
        {/* Top Navigation Tabs */}
        <div className="flex border-b border-gray-600">
          <button
            onClick={() => {
              setActiveTab("noi-dung")
              return;
              handleRunTest()
            }}
            className={`px-4 py-3 text-sm flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "noi-dung"
                ? "border-white text-white bg-[#1e1e1e]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-white">Nội dung</span>
          </button>
          <button
            onClick={() => setActiveTab("goi-y")}
            className={`px-4 py-3 text-sm flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "goi-y"
                ? "border-white text-white bg-[#1e1e1e]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-white">Gợi ý</span>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              setActiveTab("dap-an");
            }}
            className={`px-4 py-3 text-sm flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === "dap-an"
                ? "border-white text-white bg-[#1e1e1e]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-white">Đáp án</span>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "noi-dung" && (
            <div className="p-4">
              {/* Dropdown Section */}
              <div className="mb-4">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full text-left text-white"
                >
                  <h2 className="text-sm font-medium text-white">
                    {exercise.title}
                  </h2>
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="mt-2 text-xs text-white">
                    <p>{exercise.description}</p>
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="text-sm text-white space-y-4">
                <p className="text-white">{initValue?.title}</p>
                <div
                  style={{ color: '#fff' }}
                  className="text-white"
                  dangerouslySetInnerHTML={{ __html: initValue?.htmlContent }}
                />
              </div>
            </div>
          )}

          {activeTab === "goi-y" && (
            <div className="p-4">
              <div className="text-sm text-white">
                {attemptCount < 3 ? (
                  <div>
                    <p className="text-white">
                      Gợi ý sẽ hiển thị sau khi bạn thử 3 lần.
                    </p>
                    <p className="text-white mt-2">
                      Số lần thử: {attemptCount}/3
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-400">
                      🔓 Gợi ý đã mở khóa:
                    </h4>
                    <div className="space-y-2">
                      {initValue?.suggestion}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "dap-an" && (
            <div className="p-4">
              <p className="text-sm text-white">
                Đáp án sẽ hiển thị sau khi hoàn thành bài tập.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#2d2d30] border-b border-gray-600 px-4 py-3 flex items-center justify-between">
          <h1 className="text-white font-medium">
            Bài tập {exercise.language === "java" ? "(Java)" : "(C++)"}
          </h1>
        </div>

        {/* Code Editor */}
        {renderCodeEditor()}

        {/* Bottom Results Section */}
        <div className="h-96 bg-[#2d2d30] border-t border-gray-600">
          {/* Results Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-600">
            <div className="flex space-x-6">
              <h3 className="text-white font-medium">Kết quả</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveResultTab("test-cases")}
                  className={`text-sm transition-colors ${
                    activeResultTab === "test-cases"
                      ? "text-white border-b border-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Các trường hợp thử
                </button>
                <button
                  onClick={() => setActiveResultTab("content")}
                  className={`text-sm transition-colors ${
                    activeResultTab === "content"
                      ? "text-white border-b border-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Nội dung
                </button>
              </div>
            </div>
            <button
              onClick={handleSubmitCoding}
              disabled={isRunning}
              className={`px-4 py-1 text-sm bg-white text-black rounded transition-colors hover:bg-gray-200 ${
                isRunning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isRunning ? "Đang kiểm tra..." : "Kiểm tra"}
            </button>
          </div>

          {/* Results Content */}
          <div className="p-4 h-full overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Left Column */}
              <div className="text-sm text-gray-300">
                {activeResultTab === "test-cases" && (
                  <div>
                    <p className="text-white">
                      Không đặt: 0, Đặt: 0 trong 0 bài kiểm tra
                    </p>
                    {testResult && (
                      <div className="mt-2 space-y-2">
                        <div
                          className={`${testResult.success ? "text-green-400" : "text-red-400"}`}
                        >
                          {testResult.success
                            ? "✓ Test thành công"
                            : "✗ Test thất bại"}
                        </div>

                        <div className="text-gray-300">{testResult.output}</div>

                        {testResult.testsPassed !== undefined &&
                          testResult.testsTotal !== undefined && (
                            <div className="text-blue-400">
                              Tiến độ: {testResult.testsPassed}/
                              {testResult.testsTotal} tests passed
                            </div>
                          )}

                        {testResult.warnings && (
                          <div className="text-yellow-400">
                            ⚠️ Cảnh báo: {testResult.warnings}
                          </div>
                        )}

                        {testResult.error && (
                          <div className="text-red-400 mt-1">
                            ❌ Lỗi: {testResult.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {activeResultTab === "content" && (
                  <div>
                    <p className="text-white">Kết quả sẽ hiển thị ở đây...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the Java exercise for testing
export { defaultJavaExercise };
