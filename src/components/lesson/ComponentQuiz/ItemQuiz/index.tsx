import { ArrowRight } from "lucide-react";
import { useQuizStore } from "@/store/slices/lesson.slice";
import { useCreateAttemptsQuiz } from "@/hooks/queries/tracking/useTracking";
import { ArrowRotateLeft } from "iconsax-react";

interface ItemQuizProps {
  changeTab: (tab: string) => void;
  type?: "QUIZ" | "PRACTICE";
  data?: any; // Adjust type as needed
  dataTracking?: any;
  dataCourse?: any;
  setAttemptId?: any;
}

export default function ItemQuiz({
  changeTab,
  type,
  data,
  dataCourse,
  setAttemptId,
  dataTracking,
}: ItemQuizProps) {
  const setQuizStarted = useQuizStore((state) => state.setQuizStarted);

  const createLessonQuiz = useCreateAttemptsQuiz(
    dataCourse?.id as string,
    data?.id || "",
  );

  const handleStartQuiz = () => {
    if (type !== "PRACTICE") {
      createLessonQuiz.mutate(undefined, {
        onSuccess: (data) => {
          setAttemptId(data.id);
          setQuizStarted(true);
          changeTab("quizStep2");
        },
      });
    } else {
      setQuizStarted(true);
      changeTab("stepsExercise2");
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-md border border-gray-100 flex-shrink-0">
      <div className="flex justify-between flex-shrink-0">
        <div>
          <div className="text-lg font-semibold">{data?.title}</div>
          <div className="text-sm font-normal text-secondary">
            Bạn cần ít nhất{" "}
            {type === "PRACTICE"
              ? data?.passingScore
              : ((data?.passingScore / data?.maxScore) * 100).toFixed(0)}
            % điểm để vượt qua.
          </div>
          <div className="flex items-center gap-8 mt-4">
            <div>
              <div className="text-sm font-semibold text-gray-700">
                Điểm tối đa
              </div>
              <div className="text-sm font-normal text-gray-500">
                {type === "PRACTICE" ? 100 : data?.maxScore} điểm
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700">
                Thời gian
              </div>
              <div className="text-sm font-normal text-gray-500">
                {data?.duration} phút
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            handleStartQuiz();
          }}
          role="presentation"
          className="bg-[#2F57EF] cursor-pointer px-4 py-2 h-max gap-1 flex-shrink-0 flex rounded-xl text-white text-sm font-semibold"
        >
          {dataTracking?.totalAttempt > 0 ? "Thử lại" : "Bắt đầu"}
          {dataTracking?.totalAttempt > 0 ? (
            <ArrowRotateLeft size="20" color="#fff" />
          ) : (
            <ArrowRight size="20" color="#fff" />
          )}
        </div>
      </div>
    </div>
  );
}
