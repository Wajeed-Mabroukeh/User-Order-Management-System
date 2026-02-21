import { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: ReactNode;
  className?: string;
  children: ReactNode;
}

export default function Card({ title, subtitle, className = "", children }: CardProps) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || subtitle) && (
        <header className="card-header">
          {title ? <h2 className="card-title">{title}</h2> : null}
          {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
        </header>
      )}
      <div className="card-body">{children}</div>
    </section>
  );
}
