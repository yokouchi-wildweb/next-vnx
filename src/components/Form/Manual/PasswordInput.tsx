import { EyeIcon, EyeOffIcon } from "lucide-react";
import { forwardRef, useState, type ComponentProps } from "react";

import { cn } from "@/lib/cn";

import { Input } from "./Input";
import { Button } from "@/components/Form/Button/Button";

type InputProps = ComponentProps<typeof Input>;

export type PasswordInputProps = InputProps;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const { className, ...rest } = props;
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible((prev) => !prev);

  return (
    <div className="relative">
      <Input
        {...rest}
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn("pr-8", className)}
      />
      <Button
        type="button"
        onClick={toggle}
        variant="mutedIcon"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        <span className="sr-only">{visible ? "パスワードを非表示" : "パスワードを表示"}</span>
      </Button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
