import React, { useCallback } from "react";

export const Input: React.FC<{
  text?: string;
  setText?: React.Dispatch<React.SetStateAction<string>>;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  type?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  name?: string;
}> = ({ 
  text, 
  setText, 
  value, 
  onChange, 
  disabled, 
  type = "text",
  min,
  max,
  placeholder,
  name
}) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (setText) {
        setText(e.currentTarget.value);
      }
      if (onChange) {
        onChange(e);
      }
    },
    [setText, onChange],
  );

  // Use either controlled value or text prop
  const inputValue = value !== undefined ? value : text;

  return (
    <input
      className="leading-[1.7] block w-full rounded-geist bg-background p-geist-half text-foreground text-sm border border-unfocused-border-color transition-colors duration-150 ease-in-out focus:border-focused-border-color outline-none"
      disabled={disabled}
      name={name || "input"}
      type={type}
      value={inputValue}
      onChange={handleChange}
      min={min}
      max={max}
      placeholder={placeholder}
    />
  );
};