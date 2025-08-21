import {
  TickCircle,
  CloseCircle,
  ArrowRotateLeft,
} from "iconsax-react";
import { useState, useMemo, useEffect } from "react";
import {
  useCreateAttemptsQuiz,
  useHistoryTrackingQuiz,
  useSubmitQuiz,
} from "@/hooks/queries/tracking/useTracking";
import { useQuizStore } from "@/store/slices/lesson.slice";
import { ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface QuizOption {
  id: string;
  content: string;
  isCorrect: boolean;
  explanation: string;
  questionId: string;
}

interface QuizQuestion {
  id: string;
  lessonId: string;
  content: string;
  type: "MULTIPLE_CHOICE" | "SINGLE_CHOICE" | "SHORT_ANSWER";
  order: number;
  status: string;
  points: number;
  description?: string;
  correctExplanation?: string;
  incorrectHint?: string;
  isRandom: boolean;
  isRequiredAnswer: boolean;
  correctAnswer?: string | null;
  options?: QuizOption[];
  createdAt: string;
  updatedAt: string;
}

interface LessonData {
  id: string;
  moduleId: string;
  title: string;
  duration?: number;
  maxAttempts?: number;
  passingScore?: number;
  maxScore?: number;
  shortAnswerCharLimit?: number;
  questions?: QuizQuestion[];
}

type QuizState = "init" | "submitted" | "history";
type AnswerState = {
  selected: string[] | null; // Changed to string[] to handle multiple selections
  text: string;
  isCorrect: boolean | null;
  score: number; // Add score for this question
};

// BE response types
interface QuizSubmitResponse {
  attempt: {
    attemptId: string;
    score: number;
    isPassed: boolean;
    passedAt: string;
  };
  answers: {
    questionId: string;
    type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "SHORT_ANSWER";
    content: string;
    isCorrect: boolean;
    selectedOptionContent: string;
    correctOptionIds: string[];
    correctOptionContents: string[];
    explanations: string[];
    selectedOptionIds: string[];
  }[];
}

// History tracking data interface
interface HistoryTrackingData {
  attempt: {
    attemptId: string;
    startedAt: string;
    attemptAt: string;
    score: number;
    isPassed: boolean;
    passedAt: string | null;
  };
  quiz: {
    passingScore: number;
    deadline: string | null;
    timeLimitMin: number;
  };
  questions: {
    questionId: string;
    content: string;
    type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "SHORT_ANSWER";
    order: number;
    options: {
      optionId: string;
      content: string;
      isCorrect: boolean;
      explanation: string;
    }[];
    answer: string | string[] | null;
  }[];
}

export interface IQuizStepProps {
  changeTab: (tab: string) => void;
  dataCourse: any
  dataLesson: LessonData
  dataTracking: {
    maxScore: number;
    maxScoreAttempt: number;
    totalAttempt: number;
    latestQuizSubmission: {
      id: string
    }
  }
  attemptId: any
  setAttemptId: any
  dataHistoryTracking?: HistoryTrackingData; // Add this prop for history data
}

// Function to map history data to component state
const mapHistoryDataToAnswers = (historyData: HistoryTrackingData, sortedQuestions: QuizQuestion[]): AnswerState[] => {
  return sortedQuestions.map((question) => {
    const historyQuestion = historyData.questions.find(q => q.questionId === question.id);
    
    if (!historyQuestion || !historyQuestion.answer) {
      return {
        selected: null,
        text: "",
        isCorrect: null,
        score: 0
      };
    }

    // Handle different question types
    if (question.type === "SHORT_ANSWER") {
      return {
        selected: null,
        text: historyQuestion.answer as string,
        isCorrect: null, // Short answer correctness is determined by manual review
        score: 0 // Score will be calculated based on correctness
      };
    } else {
      // For SINGLE_CHOICE and MULTIPLE_CHOICE
      const selectedIds = Array.isArray(historyQuestion.answer) 
        ? historyQuestion.answer 
        : [historyQuestion.answer as string];
      
      const correctOptionIds = historyQuestion.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt.optionId);
      
      // Check if answer is correct
      let isCorrect = false;
      if (question.type === "SINGLE_CHOICE") {
        isCorrect = selectedIds.length === 1 && correctOptionIds.includes(selectedIds[0]);
      } else if (question.type === "MULTIPLE_CHOICE") {
        isCorrect = selectedIds.length === correctOptionIds.length &&
          selectedIds.every(id => correctOptionIds.includes(id)) &&
          correctOptionIds.every(id => selectedIds.includes(id));
      }
      
      return {
        selected: selectedIds,
        text: "",
        isCorrect,
        score: isCorrect ? (question.points || 0) : 0
      };
    }
  });
};

export default function QuizStep2({dataLesson, dataTracking, dataCourse, attemptId, changeTab, setAttemptId}: IQuizStepProps) {
  // Sort questions by order
  const sortedQuestions = useMemo(() => {
    if (!dataLesson?.questions) return [];
    return [...dataLesson.questions].sort((a, b) => a.order - b.order);
  }, [dataLesson?.questions]);

  // Determine if we're in history mode

  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [quizResult, setQuizResult] = useState<QuizSubmitResponse | null>(null);
  const setQuizStarted = useQuizStore((state) => state.setQuizStarted);
  const { data: dataHistoryTrackingFetch } = useHistoryTrackingQuiz(dataCourse?.id as string, dataLesson?.id as string, dataTracking?.latestQuizSubmission?.id as string);
  
  // Use provided history data or fetched data
  const currentHistoryData = dataHistoryTrackingFetch;
  const isHistoryMode = !attemptId && dataHistoryTrackingFetch;
  const [quizState, setQuizState] = useState<QuizState>("init");

  console.log(attemptId, "---attemptId");
  console.log(dataHistoryTrackingFetch, "---dataHistoryTrackingFetch");  
  console.log(isHistoryMode, "---isHistoryMode");

  // Update quizState when history data is loaded
  useEffect(() => {
    if (isHistoryMode) {
      setQuizState("history");
    } else if (attemptId) {
      setQuizState("init");
    }
  }, [isHistoryMode, attemptId]);


  const submitQuiz = useSubmitQuiz(dataCourse?.id as string, dataLesson?.id as string, attemptId as string);
  const createLessonQuiz = useCreateAttemptsQuiz(
    dataCourse?.id as string,
    dataLesson?.id || "",
  );
  const queryClient = useQueryClient()

  // Initialize answers when questions change or history data is available
  useEffect(() => {
    if (isHistoryMode && currentHistoryData) {
      // Map history data to answers state
      const mappedAnswers = mapHistoryDataToAnswers(currentHistoryData, sortedQuestions);
      setAnswers(mappedAnswers);
    } else {
      // Initialize empty answers for new quiz
      setAnswers(
        sortedQuestions.map(() => ({ 
          selected: null, 
          text: "", 
          isCorrect: null,
          score: 0
        }))
      );
    }
  }, [sortedQuestions, isHistoryMode, currentHistoryData]);

  const timeLimit = dataLesson?.duration ? `${dataLesson.duration} phút` : "Không giới hạn";

  // Calculate score - use history data, BE data, or frontend calculation
  const totalScore = useMemo(() => {
    if (isHistoryMode && currentHistoryData) {
      return currentHistoryData.attempt.score;
    }
    if (quizResult) {
      return quizResult.attempt.score;
    }
    return answers.reduce((sum, answer) => sum + answer.score, 0);
  }, [isHistoryMode, currentHistoryData, quizResult, answers]);

  const maxPossibleScore = sortedQuestions.reduce((sum, question) => sum + (question.points || 0), 0);
  
  const passed = useMemo(() => {
    if (isHistoryMode && currentHistoryData) {
      return currentHistoryData.attempt.isPassed;
    }
    if (quizResult) {
      return quizResult.attempt.isPassed;
    }
    return (totalScore / maxPossibleScore) * 100 >= (dataLesson?.passingScore || 80);
  }, [isHistoryMode, currentHistoryData, quizResult, totalScore, maxPossibleScore, dataLesson?.passingScore]);

  // Handle answer selection for multiple choice and single choice
  const handleSelect = (qIdx: number, optionId: string) => {
    if (quizState === "submitted" || quizState === "history") return;
    
    const question = sortedQuestions[qIdx];
    
    setAnswers((prev) =>
      prev.map((a, idx) => {
        if (idx !== qIdx) return a;
        
        if (question.type === "SINGLE_CHOICE") {
          return {
            ...a,
            selected: [optionId]
          };
        } else if (question.type === "MULTIPLE_CHOICE") {
          const currentSelected = a.selected || [];
          const isAlreadySelected = currentSelected.includes(optionId);
          
          return {
            ...a,
            selected: isAlreadySelected
              ? currentSelected.filter(id => id !== optionId)
              : [...currentSelected, optionId]
          };
        }
        return a;
      })
    );
  };

  // Handle text input for short answer questions
  const handleTextChange = (qIdx: number, value: string) => {
    if (quizState === "submitted" || quizState === "history") return;
    
    setAnswers((prev) =>
      prev.map((a, idx) => 
        idx === qIdx ? { ...a, text: value } : a
      )
    );
  };

  // Submit quiz
  const handleSubmit = () => {
    // Create submit data according to BE format
    const dataSubmit = {
      answers: sortedQuestions.map((question, idx) => {
        const answer = answers[idx];
        return {
          questionId: question.id,
          selectedOptionIds: answer.selected || [],
          textResponse: answer.text || ""
        };
      })
    };

    submitQuiz.mutate(dataSubmit, {
      onSuccess: (data: QuizSubmitResponse) => {
        console.log(data);
        // Store the result from BE
        setQuizResult(data);
        
        // Update answers state with results from BE
        setAnswers((prev) =>
          prev.map((answer, idx) => {
            const questionResult = data.answers.find(
              result => result.questionId === sortedQuestions[idx].id
            );
            return {
              ...answer,
              isCorrect: questionResult?.isCorrect || false,
              score: questionResult?.isCorrect ? (sortedQuestions[idx].points || 0) : 0
            };
          })
        );
        setQuizState("submitted");
      }
    });
  };

  // Retry quiz
  const handleRetry = () => {
    createLessonQuiz.mutate(undefined, {
      onSuccess: (data) => {
        setAttemptId(data.id)
        setAnswers(
          sortedQuestions.map(() => ({
            selected: null,
            text: "",
            isCorrect: null,
            score: 0
          })),
        );
        setQuizResult(null);
        setQuizState("init");
      }
    })
  };

  // Check if quiz can be submitted
  const canSubmit = sortedQuestions.every((question, idx) => {
    const answer = answers[idx];
    if (!answer) return false;
    if (!question.isRequiredAnswer) return true;
    
    if (question.type === "SHORT_ANSWER") {
      return answer.text.trim() !== "";
    } else {
      return answer.selected && answer.selected.length > 0;
    }
  });

  // Prevent errors when answers array is not ready
  if (answers.length !== sortedQuestions.length) {
    return <div>Loading...</div>;
  }

  // Score styling - include history mode
  const scoreColor = (quizState === "submitted" || quizState === "history") ? (passed ? "green" : "red") : "gray";
  const scoreBg = scoreColor === "green" ? "bg-green-50" : scoreColor === "red" ? "bg-red-50" : "bg-gray-50";
  const scoreText = scoreColor === "green" ? "text-green-600" : scoreColor === "red" ? "text-red-600" : "text-gray-600";
  const scoreBorder = scoreColor === "green" ? "border-green-200" : scoreColor === "red" ? "border-red-200" : "border-gray-200";

  const handleContinue = () => {
    setQuizStarted(false);
    queryClient.invalidateQueries({ queryKey: ["courseId", dataCourse?.id, dataLesson?.id] })
    changeTab("quizStep1");
    setAttemptId(null);
  }

  return (
    <div className="flex flex-col items-center py-10 overflow-hidden">
      <div className="w-full max-w-2xl">
        {/* Header info */}
        <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-gray-200 border-dashed bg-white rounded-t-2xl">
          <div className="flex gap-6 text-sm text-gray-700">
            <span>
              Số câu hỏi:{" "}
              <span className="font-semibold text-black">
                {sortedQuestions.length}
              </span>
            </span>
            <span>
              Số lần thử:{" "}
              <span className="font-semibold text-black">
                {dataTracking?.totalAttempt}/{dataLesson?.maxAttempts || 1}
              </span>
            </span>
          </div>
          <div className="text-sm text-gray-700 flex items-center gap-1">
            Thời gian:{" "}
            <span className="bg-[#03A9F429] text-[#0288D1] px-2 py-0.5 rounded font-medium ml-1">
              {timeLimit}
            </span>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-b-2xl shadow-xl px-8 py-8">
          {/* Results */}
          {(quizState === "submitted" || quizState === "history") && (
            <div
              className={`flex items-center justify-between px-6 py-4 mb-8 rounded-xl border ${scoreBorder} ${scoreBg} shadow-sm`}
            >
              <div>
                <div className={`font-semibold text-lg`}>
                  {quizState === "history" ? "Điểm lịch sử" : "Điểm của bạn"}:{" "}
                  <span className={`font-bold text-2xl ${scoreText}`}>
                    {totalScore}/{maxPossibleScore}
                  </span>
                  <span className={`text-sm ml-2 ${scoreText}`}>
                    (
                    {maxPossibleScore > 0
                      ? ((totalScore / maxPossibleScore) * 100).toFixed(1)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {quizState === "history"
                    ? `Thời gian làm bài: ${currentHistoryData?.attempt?.attemptAt ? new Date(currentHistoryData.attempt.attemptAt).toLocaleString("vi-VN") : "N/A"}`
                    : `Bạn cần ít nhất ${dataLesson?.passingScore || 80}% điểm để vượt qua`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {scoreColor === "green" ? (
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
                {quizState === "history" ? (
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-xl">
                    Xem lịch sử
                  </div>
                ) : scoreColor === "green" ? (
                  <button
                    onClick={handleContinue}
                    className="bg-[#2F57EF] cursor-pointer px-4 py-2 h-max flex-shrink-0 flex rounded-xl text-white text-sm font-semibold"
                  >
                    Tiếp theo
                    <ArrowRight size="20" color="#fff" />
                  </button>
                ) : (
                  <button
                    onClick={handleRetry}
                    className="ml-4 flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border border-gray-200 bg-gray-100 text-gray-700 font-semibold transition hover:bg-gray-200"
                  >
                    <ArrowRotateLeft size="20" color="gray" />
                    Thử lại
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Questions list */}
          <div className="space-y-8">
            {sortedQuestions.map((question, idx) => (
              <div key={question.id} className="">
                {/* Question */}
                <div className="flex items-start gap-2 mb-2">
                  <span className="font-semibold text-base text-gray-900 select-none">
                    {idx + 1}.
                  </span>
                  <span className="font-medium text-base text-gray-900">
                    {question.content}
                  </span>
                  <span className="text-sm text-gray-500 ml-auto">
                    ({question.points} điểm)
                  </span>
                </div>

                {/* Description */}
                {question.description && (
                  <div className="text-sm text-gray-600 ml-6 mb-3">
                    {question.description}
                  </div>
                )}

                {/* Multiple choice / Single choice answers */}
                {(question.type === "MULTIPLE_CHOICE" ||
                  question.type === "SINGLE_CHOICE") && (
                  <div className="flex flex-col gap-2 mt-2">
                    {question.options?.map((option: QuizOption) => {
                      const isSelected =
                        answers[idx].selected?.includes(option.id) || false;
                      const isCorrect =
                        (quizState === "submitted" ||
                          quizState === "history") &&
                        option.isCorrect;
                      const isWrong =
                        (quizState === "submitted" ||
                          quizState === "history") &&
                        isSelected &&
                        !option.isCorrect;

                      return (
                        <label
                          key={option.id}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg border cursor-pointer transition-all
                            ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}
                            ${isCorrect && isSelected ? "border-green-500 bg-green-50" : ""}
                            ${isCorrect && !isSelected && (quizState === "submitted" || quizState === "history") ? "border-green-300 bg-green-50/50" : ""}
                            ${isWrong ? "border-red-500 bg-red-50" : ""}
                            hover:border-blue-400
                            ${quizState === "submitted" || quizState === "history" ? "cursor-default" : ""}
                          `}
                        >
                          <input
                            type={
                              question.type === "MULTIPLE_CHOICE"
                                ? "checkbox"
                                : "radio"
                            }
                            name={`q${idx}`}
                            checked={isSelected}
                            disabled={
                              quizState === "submitted" ||
                              quizState === "history"
                            }
                            onChange={() => handleSelect(idx, option.id)}
                            className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="font-medium text-gray-900 flex-1">
                            {option.content}
                          </span>
                          {(quizState === "submitted" ||
                            quizState === "history") &&
                            isCorrect && (
                              <TickCircle
                                size={20}
                                className="text-green-500"
                              />
                            )}
                          {(quizState === "submitted" ||
                            quizState === "history") &&
                            isWrong && (
                              <CloseCircle size={20} className="text-red-500" />
                            )}
                          {/* Show correct indicator even if not selected in history/submitted mode */}
                          {(quizState === "submitted" ||
                            quizState === "history") &&
                            option.isCorrect &&
                            !isSelected && (
                              <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                Đúng
                              </div>
                            )}
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Short answer */}
                {question.type === "SHORT_ANSWER" && (
                  <div className="mt-2">
                    <textarea
                      className="w-full min-h-[48px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                      placeholder="Nhập câu trả lời"
                      value={answers[idx].text}
                      disabled={
                        quizState === "submitted" || quizState === "history"
                      }
                      onChange={(e) => handleTextChange(idx, e.target.value)}
                      maxLength={dataLesson?.shortAnswerCharLimit || 100}
                    />
                    {dataLesson?.shortAnswerCharLimit && (
                      <div className="text-xs text-gray-500 mt-1">
                        {answers[idx].text.length}/
                        {dataLesson.shortAnswerCharLimit} ký tự
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation */}
                {(quizState === "submitted" || quizState === "history") && (
                  <div className="mt-2 flex items-start gap-2 text-sm">
                    {answers[idx].isCorrect === true ? (
                      <TickCircle size={18} className="mt-0.5 text-green-500" />
                    ) : answers[idx].isCorrect === false ? (
                      <CloseCircle size={18} className="mt-0.5 text-red-500" />
                    ) : (
                      <div className="w-4 h-4 mt-0.5 rounded-full border-2 border-gray-400 bg-gray-100"></div>
                    )}
                    <div
                      className={
                        answers[idx].isCorrect === true
                          ? "text-green-700"
                          : answers[idx].isCorrect === false
                            ? "text-red-700"
                            : "text-gray-600"
                      }
                    >
                      {answers[idx].isCorrect === null
                        ? "Câu hỏi chưa được trả lời"
                        : quizState === "history"
                          ? // For history mode, show basic explanation based on correctness
                            answers[idx].isCorrect
                            ? question.correctExplanation || "Câu trả lời đúng"
                            : question.incorrectHint || "Câu trả lời sai"
                          : quizResult && quizResult.answers.length > 0
                            ? // Use explanation from BE response for submitted quiz
                              (() => {
                                const questionResult = quizResult.answers.find(
                                  (result) => result.questionId === question.id,
                                );
                                return questionResult?.explanations &&
                                  questionResult.explanations.length > 0
                                  ? questionResult.explanations.join(", ")
                                  : answers[idx].isCorrect
                                    ? question.correctExplanation
                                    : question.incorrectHint;
                              })()
                            : // Fallback to frontend data
                              answers[idx].isCorrect
                              ? question.correctExplanation
                              : question.incorrectHint}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="flex gap-3 justify-end">
          {quizState === "init" && (
            <div className="flex justify-end mt-10">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 transition disabled:opacity-60"
              >
                Nộp bài
              </button>
            </div>
          )}

          {/* History mode - no action buttons needed, just informational text */}
          <div className="flex justify-end mt-10">
            <button
              onClick={() => {
                changeTab("quizStep1");
                setAttemptId(null);
              }}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 transition disabled:opacity-60"
            >
              Trở lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
