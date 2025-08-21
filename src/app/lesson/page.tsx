import LessonClient from "./LessonClient";
import {Suspense} from "react";

export default function LessonPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LessonClient />
    </Suspense>
  )
}