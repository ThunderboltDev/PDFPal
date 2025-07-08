"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import "@/css/switch.css";

export default function Switch({
  checked = false,
  onChange,
  label = "",
  disabled = false,
  fullWidth = true,
  ...props
}) {

  const id = useId();
  const labelId = `switch-button-${id}`

  return (
    <div className="switch-wrapper" data-full-width={fullWidth} {...props}>
      <div className="switch-label">
        <label htmlFor={labelId}>
          {label}
        </label>
      </div>
      <button
        id={labelId}
        type="button"
        title={label}
        className="switch-button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        aria-label={label}
        aria-checked={checked}
        aria-disabled={disabled}
        role="switch"
      >
        <motion.span
          className="switch-thumb"
          layout
          transition={{ duration: 0.2, ease: "easeIn" }}
          initial={false}
          animate={{ x: checked ? 20 : 0 }}
        />
      </button>
    </div>
  );
}
