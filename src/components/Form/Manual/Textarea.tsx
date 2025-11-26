import { forwardRef, type ComponentProps } from "react";

import { Textarea as ShadcnTextarea } from "@/components/_shadcn/textarea";

export type TextareaProps = ComponentProps<typeof ShadcnTextarea>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  return <ShadcnTextarea ref={ref} {...props} />;
});

Textarea.displayName = "Textarea";
