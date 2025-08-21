import React, { useEffect, useState } from "react";
import { useQuizStore } from "@/store/slices/lesson.slice";
import StepsExercise1 from "@/components/lesson/ComponentExercise/StepsExercise1";
import StepsExercise2 from "@/components/lesson/ComponentExercise/StepsExercise2";
import { usePracticeTracking } from "@/hooks/queries/tracking/useTracking";

interface QuizLessonProps {
  dataCourse: any;
  dataLesson: any;
}

export default function ExerciseLesson({ dataCourse, dataLesson }: QuizLessonProps) {
  const [tab, setTab] = useState("stepsExercise1");
  const isQuizStarted = useQuizStore((state) => state.isQuizStarted);
  const { data: dataTracking } = usePracticeTracking(dataCourse?.id as string, dataLesson?.id as string);

  const tabList = {
    stepsExercise1: {
      component: StepsExercise1,
    },
    stepsExercise2: {
      component: StepsExercise2,
    },
  };

  useEffect(() => {
    setTab("stepsExercise1");
  }, []);

  return(
    <div className={`md:mx-20 mx-4 ${isQuizStarted ? 'h-full' : 'h-[60vh] overflow-auto'}`}>
      <div>
        {React.createElement(tabList[tab as keyof typeof tabList].component, {
          tab: tab,
          changeTab: setTab,
          dataCourse: dataCourse,
          dataLesson: dataLesson,
          dataTracking: dataTracking
        })}
      </div>
    </div>
  )
}