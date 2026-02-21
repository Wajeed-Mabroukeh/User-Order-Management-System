import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Brand from "../components/layout/Brand";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../services/http";

function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="field-icon-svg" aria-hidden="true">
      <path
        d="M12 12.75a4.875 4.875 0 1 0 0-9.75 4.875 4.875 0 0 0 0 9.75zm0 1.5c-3.74 0-7.5 1.96-7.5 5.65 0 .33.27.6.6.6h13.8c.33 0 .6-.27.6-.6 0-3.69-3.76-5.65-7.5-5.65z"
        fill="currentColor"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="field-icon-svg" aria-hidden="true">
      <path
        d="M3.75 5.5h16.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75V6.25a.75.75 0 0 1 .75-.75zm.75 2.01v9.49h15V7.51l-7.05 4.37a.75.75 0 0 1-.9 0L4.5 7.51zM6.18 7l5.82 3.61L17.82 7H6.18z"
        fill="currentColor"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="field-icon-svg" aria-hidden="true">
      <path
        d="M7 10V8a5 5 0 1 1 10 0v2h.75A2.25 2.25 0 0 1 20 12.25v7.5A2.25 2.25 0 0 1 17.75 22h-11.5A2.25 2.25 0 0 1 4 19.75v-7.5A2.25 2.25 0 0 1 6.25 10H7zm1.5 0h7V8a3.5 3.5 0 1 0-7 0v2zm-2.25 1.5a.75.75 0 0 0-.75.75v7.5c0 .414.336.75.75.75h11.5a.75.75 0 0 0 .75-.75v-7.5a.75.75 0 0 0-.75-.75h-11.5z"
        fill="currentColor"
      />
    </svg>
  );
}

interface LoginPageProps {
  mode?: "login" | "register";
}

export default function LoginPage({ mode = "login" }: LoginPageProps) {
  const isRegisterMode = mode === "register";
  const navigate = useNavigate();
  const { login, register, isAuthLoading, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setFormError("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    let hasValidationError = false;

    if (isRegisterMode) {
      if (!normalizedName) {
        setNameError("Name is required.");
        hasValidationError = true;
      } else if (normalizedName.length < 2) {
        setNameError("Name must be at least 2 characters.");
        hasValidationError = true;
      }
    }

    if (!normalizedEmail) {
      setEmailError("Email is required.");
      hasValidationError = true;
    } else if (!isEmailValid(normalizedEmail)) {
      setEmailError("Please enter a valid email.");
      hasValidationError = true;
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasValidationError = true;
    } else if (isRegisterMode && password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    try {
      if (isRegisterMode) {
        await register({ name: normalizedName, email: normalizedEmail, password });
      } else {
        await login({ email: normalizedEmail, password });
      }
      navigate("/profile", { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Brand />

        <div className="header-group">
          <span className="header-copy">{isRegisterMode ? "Already have an account?" : "New user?"}</span>
          {isRegisterMode ? (
            <Button type="button" variant="outline" className="header-signup" onClick={() => navigate("/login")}>
              Login
            </Button>
          ) : (
            <Button type="button" className="header-signup" onClick={() => navigate("/register")}>
              Sign up
            </Button>
          )}
        </div>
      </header>

      <main className="app-main">
        <section className="app-canvas login-canvas">
          <Card
            className={`login-card ${isRegisterMode ? "register-card" : ""}`.trim()}
            title={isRegisterMode ? "Create Account" : "Sign in"}
            subtitle={
              <span className="login-subtitle">
                {isRegisterMode ? "Get started with your dashboard" : "Access your account"}
              </span>
            }
          >
            <form onSubmit={handleSubmit} className="stack" noValidate>
              {isRegisterMode ? (
                <InputField
                  id="name"
                  label="Name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  error={nameError}
                  placeholder="Full name"
                  hideLabel
                  variant="line"
                  startIcon={<UserIcon />}
                />
              ) : null}

              <InputField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={emailError}
                placeholder="Email address"
                hideLabel
                variant="line"
                startIcon={<MailIcon />}
              />

              <InputField
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={passwordError}
                placeholder="Password"
                hideLabel
                variant="line"
                startIcon={<LockIcon />}
              />

              {formError ? <Alert variant="error" message={formError} /> : null}

              <Button type="submit" fullWidth isLoading={isAuthLoading}>
                {isRegisterMode ? "Create Account" : "Login"}
              </Button>
            </form>

            {isRegisterMode ? (
              <p className="auth-alt-link">
                Already registered?{" "}
                <button type="button" className="auth-inline-link button-link" onClick={() => navigate("/login")}>
                  Sign in
                </button>
              </p>
            ) : null}
          </Card>
        </section>
      </main>
    </div>
  );
}
