"use client";
import { ElementType, ComponentProps, useEffect, useRef } from "react";

interface TextEditorProps {
  as?: ElementType;
  value: string;
  placeholder: string;
  onChange: (val: string) => void;
}

export default function TextEditor<E extends ElementType>({
  as,
  value,
  placeholder,
  onChange,
  ...props
}: TextEditorProps & ComponentProps<E>) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as || "p") as ElementType;

  const handleInput = () => {
    if (ref.current) onChange(ref.current.innerText);
  };

  const handleBlur = () => {
    if (!ref.current) return;
    const text = ref.current.innerText.trim();
    if (!text) {
      ref.current.innerHTML = "";
      onChange("");
    }
  };

  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.innerText = value;
    }
  }, [value]);

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onBlur={handleBlur}
      style={{ outline: "none", cursor: "text" }}
      tabIndex={0}
      data-placeholder={placeholder}
      {...props}
    />
  );
}
