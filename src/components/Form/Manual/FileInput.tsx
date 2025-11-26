import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  type ChangeEvent,
  type ComponentProps,
} from "react";
import { XIcon } from "lucide-react";

import { Button } from "@/components/Form/Button/Button";
import { Block } from "@/components/Layout/Block";
import { ImageUploaderSkeleton } from "@/components/Skeleton/ImageUploaderSkeleton";
import { cn } from "@/lib/cn";

type NativeInputProps = ComponentProps<"input">;

type BaseProps = Omit<
  NativeInputProps,
  "type" | "value" | "defaultValue" | "onChange" | "onInput"
>;

export type FileInputProps = BaseProps & {
  value?: File | null;
  onValueChange?: (file: File | null) => void;
  initialUrl?: string | null;
  onFileSelect?: (file: File | null) => void;
  onRemove?: () => boolean | Promise<boolean>;
  containerClassName?: string;
  selectedFileName?: string | null;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>((props, forwardedRef) => {
  const {
    value,
    onValueChange,
    initialUrl = null,
    onFileSelect,
    onRemove,
    containerClassName,
    selectedFileName: selectedFileNameProp,
    className,
    disabled,
    id,
    onBlur,
    name,
    accept,
    multiple,
    required,
    onChange,
    ...rest
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl);
  const [isPreviewLoading, setIsPreviewLoading] = useState(
    Boolean(initialUrl && !initialUrl.startsWith("blob:")),
  );
  const [inputKey, setInputKey] = useState(0);

  const inputId = useMemo(() => id ?? `${name ?? "file"}-${inputKey}`, [id, name, inputKey]);

  const selectedFileName = useMemo(() => {
    if (typeof selectedFileNameProp === "string") {
      return selectedFileNameProp.length > 0 ? selectedFileNameProp : null;
    }
    if (value instanceof File) {
      return value.name;
    }
    return null;
  }, [selectedFileNameProp, value]);

  useEffect(() => {
    setPreview(initialUrl);
    setIsPreviewLoading(Boolean(initialUrl && !initialUrl.startsWith("blob:")));
  }, [initialUrl]);

  const revokePreviewUrl = useCallback((url: string | null) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }, []);

  useEffect(() => {
    return () => {
      revokePreviewUrl(preview);
    };
  }, [preview, revokePreviewUrl]);

  const handleRemove = useCallback(async () => {
    const shouldRemove = onRemove ? await onRemove() : true;
    if (!shouldRemove) return;
    onValueChange?.(null);
    onFileSelect?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    revokePreviewUrl(preview);
    setPreview(null);
    setIsPreviewLoading(false);
    setInputKey((k) => k + 1);
  }, [onRemove, onFileSelect, onValueChange, preview, revokePreviewUrl]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      const file = event.target.files?.[0] ?? null;
      onValueChange?.(file);
      onFileSelect?.(file);
      revokePreviewUrl(preview);
      if (file) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        setIsPreviewLoading(false);
      } else {
        setPreview(null);
        setIsPreviewLoading(false);
      }
    },
    [onChange, onFileSelect, onValueChange, preview, revokePreviewUrl],
  );

  return (
    <Block space="sm" className={cn("w-full", containerClassName)}>
      <label
        htmlFor={inputId}
        className={cn(
          "flex min-h-24 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded border border-dashed border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground transition-colors",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-60",
          className,
        )}
      >
        <div className="flex w-full flex-col items-center gap-3">
          {preview && (
            <div className="relative flex max-w-full items-center justify-center">
              <div className="relative flex h-40 w-full max-w-[320px] items-center justify-center overflow-hidden rounded bg-muted p-2">
                {isPreviewLoading && <ImageUploaderSkeleton />}
                <img
                  src={preview}
                  alt="preview"
                  className={cn(
                    "z-[1] max-h-full w-auto object-contain transition-opacity",
                    isPreviewLoading && "opacity-0",
                  )}
                  onLoad={() => setIsPreviewLoading(false)}
                  onError={() => setIsPreviewLoading(false)}
                />
              </div>
              {!isPreviewLoading && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 z-10"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    void handleRemove();
                  }}
                >
                  <XIcon className="size-5" />
                  <span className="sr-only">画像を削除</span>
                </Button>
              )}
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            {selectedFileName ? (
              <span className="break-all text-center font-medium">選択中: {selectedFileName}</span>
            ) : (
              <span className="text-center font-medium text-muted-foreground">
                クリックしてファイルを選択
              </span>
            )}
          </div>
        </div>
      </label>
      <input
        key={inputKey}
        ref={(node) => {
          inputRef.current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        id={inputId}
        type="file"
        name={name}
        disabled={disabled}
        onBlur={onBlur}
        accept={accept}
        multiple={multiple}
        required={required}
        className="sr-only"
        onChange={handleChange}
        {...rest}
      />
    </Block>
  );
});

FileInput.displayName = "FileInput";
