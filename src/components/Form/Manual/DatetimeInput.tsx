import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { CalendarClock } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  type ComponentProps,
  type ChangeEventHandler,
} from "react";

import { cn } from "@/lib/cn";

import { Input } from "./Input";

type InputProps = ComponentProps<typeof Input>;
type DatetimeLike = string | Date | number | Dayjs | null | undefined;

type BaseProps = Omit<InputProps, "type" | "value" | "defaultValue" | "onChange">;

export type DatetimeInputProps = BaseProps & {
  value?: DatetimeLike;
  defaultValue?: DatetimeLike;
  onValueChange?: (value: string) => void;
  containerClassName?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const formatDatetimeValue = (value: DatetimeLike): string => {
  if (value == null) return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    const parsed = dayjs(trimmed);
    return parsed.isValid() ? parsed.format("YYYY-MM-DDTHH:mm") : "";
  }

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("YYYY-MM-DDTHH:mm") : "";
};

export const DatetimeInput = forwardRef<HTMLInputElement, DatetimeInputProps>(
  (props, forwardedRef) => {
    const {
      value,
      defaultValue,
      onValueChange,
      containerClassName,
      className,
    onFocus,
    onClick,
    onChange,
    ...rest
  } = props;

    const localRef = useRef<HTMLInputElement | null>(null);

    const assignRef = useCallback(
      (node: HTMLInputElement | null) => {
        localRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    const openPicker = useCallback(() => {
      const el = localRef.current;
      if (el && typeof (el as any).showPicker === "function") {
        (el as any).showPicker();
      }
    }, []);

    const resolvedValue = useMemo(() => {
      if (typeof value === "undefined") return undefined;
      return formatDatetimeValue(value);
    }, [value]);

    const resolvedDefaultValue = useMemo(() => {
      if (typeof value !== "undefined" || typeof defaultValue === "undefined") {
        return undefined;
      }
      return formatDatetimeValue(defaultValue);
    }, [defaultValue, value]);

    return (
      <div className={cn("relative flex h-9 items-center", containerClassName)}>
        <Input
        {...rest}
        ref={assignRef}
          type="datetime-local"
          className={cn("pr-8", className)}
          value={resolvedValue}
          defaultValue={resolvedValue === undefined ? resolvedDefaultValue : undefined}
          onFocus={(event) => {
            onFocus?.(event);
            openPicker();
          }}
          onClick={(event) => {
            onClick?.(event);
            openPicker();
          }}
          onChange={(event) => {
            onChange?.(event);
            onValueChange?.(event.target.value);
          }}
        />
        <CalendarClock className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    );
  },
);

DatetimeInput.displayName = "DatetimeInput";
