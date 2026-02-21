import { InputHTMLAttributes, ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  startIcon?: ReactNode;
  variant?: "default" | "line";
  hideLabel?: boolean;
}

export default function InputField({
  id,
  label,
  error,
  startIcon,
  variant = "default",
  hideLabel = false,
  ...props
}: InputFieldProps) {
  return (
    <div className={`field field-${variant}`}>
      <label htmlFor={id} className={hideLabel ? "field-label sr-only" : "field-label"}>
        {label}
      </label>
      <div className={`field-control ${error ? "field-control-error" : ""}`}>
        {startIcon ? <span className="field-icon">{startIcon}</span> : null}
        <input id={id} className="field-input" {...props} />
      </div>
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
