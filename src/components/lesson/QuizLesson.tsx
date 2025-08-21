import React, { useState } from "react";
import QuizStep1 from "@/components/lesson/ComponentQuiz/StepQuiz/QuizStep1";
import QuizStep2 from "@/components/lesson/ComponentQuiz/StepQuiz/QuizStep2";
import { useQuizStore } from "@/store/slices/lesson.slice";
import { useTrackingQuiz } from "@/hooks/queries/tracking/useTracking";

interface QuizLessonProps {
  dataCourse: any;
  dataLesson: any;
}

export default function QuizLesson({ dataCourse, dataLesson }: QuizLessonProps) {
  const [tab, setTab] = useState("quizStep1");
  const isQuizStarted = useQuizStore((state) => state.isQuizStarted);
  const { data: dataTracking } = useTrackingQuiz(dataCourse?.id as string, dataLesson?.id as string);
  const [attemptId, setAttemptId] = useState<string | null>(null);


  const tabList = {
    quizStep1: {
      component: QuizStep1,
    },
    quizStep2: {
      component: QuizStep2,
    },
  };

  return (
    <div className={`md:mx-20 mx-4 ${isQuizStarted ? 'h-full' : 'h-[60vh] overflow-auto'}`}>
      <div>
        {React.createElement(tabList[tab as keyof typeof tabList].component, {
          tab: tab,
          changeTab: setTab,
          dataCourse: dataCourse,
          dataLesson: dataLesson,
          dataTracking: dataTracking,
          setAttemptId: setAttemptId,
          attemptId: attemptId
        })}
      </div>
    </div>
  );
}