import { useQuizStore } from "@/store/slices/lesson.slice";
import { useEffect } from "react";
import he from "he";

interface IDocumentLessonProps {
  data: any;
}

export default function DocumentLesson({ data }: IDocumentLessonProps) {
  const setQuizStarted = useQuizStore((state) => state.setQuizStarted);

  useEffect(() => {
    setQuizStarted(false);
  }, []);

  return (
    <div className="md:mx-20 mx-4 h-[60vh] overflow-auto">
      <h1 className="text-2xl font-bold mb-4">{data?.title}</h1>
      <p className="text-gray-700">
        {data?.htmlContent && (
          <div
            dangerouslySetInnerHTML={{ __html: he.decode(data?.htmlContent) }}
          />
        )}
      </p>
    </div>
  );
}
