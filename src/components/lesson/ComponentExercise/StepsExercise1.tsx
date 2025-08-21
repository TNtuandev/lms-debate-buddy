import ItemResultTracking from "@/components/lesson/ComponentQuiz/ItemResultTracking";
import { useEffect } from "react";
import { useQuizStore } from "@/store/slices/lesson.slice";
import ItemQuizTracking from "@/components/lesson/ComponentQuiz/ItemQuizTracking";

export interface IQuizStepProps {
  changeTab: (tab: string) => void;
  dataCourse: any
  dataLesson: any
  dataTracking: any
  tab: any
}

export default function StepsExercise1({changeTab, dataCourse, dataLesson, dataTracking, tab}: IQuizStepProps) {
  const setQuizStarted = useQuizStore((state) => state.setQuizStarted);

  useEffect(() => {
    if (tab === "stepsExercise1") {
      setQuizStarted(false)
    }
  }, [tab]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{dataCourse?.title}</h1>
      <ItemQuizTracking changeTab={changeTab} type="PRACTICE" data={dataLesson} dataCourse={dataCourse} dataTracking={dataTracking} />
      <ItemResultTracking dataTracking={dataTracking} dataLesson={dataLesson} changeTab={changeTab} />
    </div>
  )
}