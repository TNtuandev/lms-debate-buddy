import * as React from "react"

import { cn } from "@/lib/utils"


interface TextAreaProps extends React.ComponentProps<"textarea">{
  helperText?: string;
  invalid?: boolean
};

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextAreaProps
>(({ className, invalid, ...props }, ref) => {

  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-[#919EAB52]",
        className,
        invalid && "border-error-main/80",
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
