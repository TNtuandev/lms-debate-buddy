import ItemQuiz from "@/components/lesson/ComponentQuiz/ItemQuiz";
import ItemResult from "@/components/lesson/ComponentQuiz/ItemResult";
import { useEffect } from "react";
import { useQuizStore } from "@/store/slices/lesson.slice";

export interface IQuizStepProps {
  changeTab: (tab: string) => void;
  dataCourse: any
  dataLesson: any
  dataTracking: any
  setAttemptId: any,
  attemptId: any
  tab: any
}

export default function QuizStep1({changeTab, dataCourse, dataLesson, dataTracking, setAttemptId, tab}: IQuizStepProps) {
  const setQuizStarted = useQuizStore((state) => state.setQuizStarted);

  useEffect(() => {
    if (tab === "quizStep1") {
      setQuizStarted(false)
    }
  }, [tab]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{dataCourse?.title}</h1>
      <ItemQuiz setAttemptId={setAttemptId} dataCourse={dataCourse} changeTab={changeTab} type={dataLesson?.type} data={dataLesson} dataTracking={dataTracking} />
      <ItemResult dataTracking={dataTracking} changeTab={changeTab} />
    </div>
  )
}