"use client";

import { useEffect, useState } from "react";
import { formatCopInput, parseCopInput } from "@/lib/billing/format-currency";

type AmountInputProps = {
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

export function AmountInput({
  value,
  onChange,
  required,
  placeholder = "0",
  className,
}: AmountInputProps) {
  const [display, setDisplay] = useState(() => formatCopInput(value));

  useEffect(() => {
    setDisplay(formatCopInput(value));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = parseCopInput(e.target.value);
    setDisplay(formatCopInput(next));
    onChange(next);
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      required={required}
      value={display}
      onChange={handleChange}
      placeholder={placeholder}
      className={
        className ??
        "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-border-hover"
      }
    />
  );
}
