interface AlertProps {
  variant?: "error" | "info" | "success";
  message: string;
}

export default function Alert({ variant = "info", message }: AlertProps) {
  return <p className={`alert alert-${variant}`}>{message}</p>;
}
