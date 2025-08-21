"use client";

import Image from "next/image";
import React, { useEffect } from "react";

export function CircleTextAnimation() {
  const textRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(textRef.current) {
      textRef.current.innerHTML = textRef.current.innerText.split("")
        .map(
          (char, i) => `<span style="transform:rotate(${i * 17.3}deg)">${char}</span>`
        )
        .join("");
    }
  }, [textRef])

  return (
    <div className="backdrop-blur-sm relative w-[120px] h-[120px] border-[1px] border-white rounded-full flex items-center justify-center">
      <div className="absolute">
        <Image className="rounded-full" src="/images/home/img_4.png" alt="" width={48} height={48} />
      </div>
      <div ref={textRef} className="text text-lg absolute w-full h-full text-primary-contrastText ">
        <p>
          Giấy chứng nhận 100%
        </p>
      </div>
    </div>
  )
}