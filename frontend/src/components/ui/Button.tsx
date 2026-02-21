import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const classes = [
    "ui-button",
    `ui-button-${variant}`,
    fullWidth ? "ui-button-full" : "",
    className
  ]
    .join(" ")
    .trim();

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? "Please wait..." : children}
    </button>
  );
}
