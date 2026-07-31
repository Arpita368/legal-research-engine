"use client";

// This screen handles the authentication journey. It supports login, signup, password reset,
// and verification steps while keeping the UX simple for a legal workspace.
import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  LogIn,
  RefreshCw,
  Scale,
  Server,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { roles } from "@/components/data/legalData";
import {
  createDemoSession,
  loginUser,
  signUpUser,
} from "@/components/auth/authStore";

function BrandMark({ inverse = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`grid size-10 place-items-center rounded-lg border ${inverse ? "border-white bg-white text-teal-950" : "border-teal-950 bg-teal-950 text-white dark:border-teal-100 dark:bg-teal-100 dark:text-teal-950"}`}
      >
        <Scale className="size-5" />
      </div>
      <div>
        <div className="text-sm font-semibold">Legal Research Engine</div>
        <div
          className={`text-xs ${inverse ? "text-zinc-400" : "text-zinc-500"}`}
        >
          Commercial Courts Workspace
        </div>
      </div>
    </div>
  );
}

function AuthHeader({ authMode, onAuthModeChange }) {
  const title = {
    login: "Login",
    signup: "Signup",
    forgot: "Forgot Password",
    reset: "Reset Password",
    verify: "Verify Email",
  }[authMode];

  return (
    <div className="mb-5">
      <div className="glass-row mb-4 grid grid-cols-2 rounded-lg p-1">
        {["login", "signup"].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onAuthModeChange(mode)}
            className={`h-9 rounded-md text-sm font-medium transition ${authMode === mode ? "bg-teal-950 text-white dark:bg-teal-100 dark:text-teal-950" : "text-zinc-600 hover:bg-white/45 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"}`}
          >
            {mode === "login" ? "Login" : "Signup"}
          </button>
        ))}
      </div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Choose your workspace type and continue into your legal research desk.
      </p>
    </div>
  );
}

function StatusBanner({ status }) {
  const Icon =
    status.type === "error"
      ? AlertTriangle
      : status.type === "success"
        ? Check
        : RefreshCw;

  return (
    <div
      className={`mb-4 flex items-center gap-3 rounded-lg border p-3 text-sm backdrop-blur-xl ${status.type === "error" ? "border-rose-300/70 bg-rose-50/70 text-rose-950 dark:border-rose-300/25 dark:bg-rose-400/10 dark:text-rose-100" : "border-white/60 bg-white/45 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-200"}`}
    >
      <Icon className={`size-4 ${status.loading ? "animate-spin" : ""}`} />
      <span>{status.message}</span>
    </div>
  );
}

function AuthReadinessRow({ icon: Icon, label }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Icon className="size-4 text-zinc-300" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <Check className="size-4 text-white" />
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="glass-input h-11 rounded-lg px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-600/50 focus:ring-2 focus:ring-teal-500/15 dark:placeholder:text-zinc-600 dark:focus:border-teal-200/40 dark:focus:ring-teal-200/10"
      />
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>{label}</span>
      <div className="glass-input flex h-11 items-center rounded-lg px-3 focus-within:border-teal-600/50 focus-within:ring-2 focus-within:ring-teal-500/15 dark:focus-within:border-teal-200/40 dark:focus-within:ring-teal-200/10">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Minimum 8 characters"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        />
        <button
          type="button"
          aria-label="Show Password"
          title="Show Password"
          onClick={() => setShowPassword(!showPassword)}
          className="grid size-8 place-items-center rounded-md text-zinc-500 hover:bg-white/55 hover:text-zinc-950 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </label>
  );
}

function PasswordStrength({ strength }) {
  const labels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
        <span>Password Strength Meter</span>
        <span>{labels[Math.max(strength - 1, 0)]}</span>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-2 rounded-sm ${step <= strength ? "bg-zinc-950 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800"}`}
          />
        ))}
      </div>
    </div>
  );
}

function OtpInput({ otp, updateOtp }) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <KeyRound className="size-4" />
        <span>Verification Code</span>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            aria-label={`OTP digit ${index + 1}`}
            inputMode="numeric"
            value={digit}
            onChange={(event) => updateOtp(index, event.target.value)}
            className="glass-input h-12 rounded-lg text-center text-lg font-semibold outline-none focus:border-teal-600/50 focus:ring-2 focus:ring-teal-500/15 dark:focus:border-teal-200/40 dark:focus:ring-teal-200/10"
          />
        ))}
      </div>
    </div>
  );
}

function RoleSelect({ role, setRole, compact = false }) {
  return (
    <label className="relative">
      <span className="sr-only">Role</span>
      <select
        value={role}
        onChange={(event) => setRole(event.target.value)}
        className={`glass-input appearance-none rounded-lg text-sm font-medium outline-none ${compact ? "h-9 px-3 pr-8" : "h-10 px-3 pr-8"}`}
      >
        {roles.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-zinc-500">
        ⌄
      </span>
    </label>
  );
}

export function AuthExperience({
  authMode,
  onAuthModeChange,
  onAuthenticated,
  role,
  setRole,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
    otp: ["", "", "", "", "", ""],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({
    type: "idle",
    message: "",
    loading: false,
  });

  const strength = getPasswordStrength(form.password);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateOtp = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    setForm((current) => {
      const nextOtp = [...current.otp];
      nextOtp[index] = digit;
      return { ...current, otp: nextOtp };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateAuth(authMode, form);

    if (validation) {
      setStatus({ type: "error", message: validation, loading: false });
      return;
    }

    setStatus({
      type: "loading",
      message: "Checking your details",
      loading: true,
    });

    window.setTimeout(async () => {
      try {
        if (authMode === "forgot") {
          setStatus({
            type: "success",
            message: "Reset instructions are ready for this account",
            loading: false,
          });
          onAuthModeChange("reset");
          return;
        }

        if (authMode === "reset") {
          setStatus({
            type: "success",
            message: "Password reset complete",
            loading: false,
          });
          onAuthModeChange("verify");
          return;
        }

        if (authMode === "signup") {
          const result = await signUpUser({
            name: form.name,
            email: form.email,
            password: form.password,
            role,
          });

          if (!result.ok) {
            setStatus({ type: "error", message: result.error, loading: false });
            return;
          }

          setStatus({
            type: "success",
            message: "Account created. Opening dashboard",
            loading: false,
          });
          window.setTimeout(() => onAuthenticated(result.user), 450);
          return;
        }

        const result = await loginUser({
          email: form.email,
          password: form.password,
        });

        if (!result.ok) {
          setStatus({ type: "error", message: result.error, loading: false });
          return;
        }

        setStatus({
          type: "success",
          message: "Sign in complete. Opening dashboard",
          loading: false,
        });
        window.setTimeout(() => onAuthenticated(result.user), 450);
      } catch (error) {
        setStatus({
          type: "error",
          message: error.message || "Unable to complete authentication",
          loading: false,
        });
      }
    }, 700);
  };

  const socialAuth = async (provider) => {
    setStatus({
      type: "loading",
      message: `Connecting with ${provider}`,
      loading: true,
    });

    try {
      const demoUser = {
        id: `${Date.now()}`,
        name: "Demo User",
        email: `${provider.toLowerCase()}@example.com`,
        role,
      };
      const result = await createDemoSession(demoUser);
      setStatus({
        type: "success",
        message: `${provider} sign in complete. Opening dashboard`,
        loading: false,
      });
      window.setTimeout(() => onAuthenticated(result.user), 350);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to complete social sign in",
        loading: false,
      });
    }
  };

  return (
    <div className="min-h-screen glass-app text-zinc-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_520px]">
        <section className="hidden border-r border-white/15 bg-zinc-950/75 text-white backdrop-blur-2xl lg:block">
          <div className="flex h-full flex-col justify-between p-10">
            <div>
              <BrandMark inverse />
              <div className="mt-12 max-w-3xl">
                <p className="text-sm text-zinc-400">
                  Commercial Courts Research Engine
                </p>
                <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight">
                  Citation grounded research for litigation teams.
                </h1>
              </div>
            </div>

            <div className="grid gap-3">
              <AuthReadinessRow icon={KeyRound} label="Secure sign in" />
              <AuthReadinessRow icon={LockKeyhole} label="Private workspace" />
              <AuthReadinessRow
                icon={ShieldCheck}
                label="Verified research access"
              />
              <AuthReadinessRow icon={Server} label="Dataset health visible" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                {roles.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={`h-10 rounded-lg border text-xs font-medium backdrop-blur-xl transition ${role === item ? "border-white bg-white/90 text-zinc-950" : "border-white/15 bg-white/10 text-zinc-300 hover:border-white/35 hover:bg-white/15"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <BrandMark />
              <RoleSelect role={role} setRole={setRole} compact />
            </div>

            <div className="glass-panel rounded-lg p-5">
              <AuthHeader
                authMode={authMode}
                onAuthModeChange={onAuthModeChange}
              />
              {status.type !== "idle" ? <StatusBanner status={status} /> : null}

              {authMode === "login" || authMode === "signup" ? (
                <div className="mb-4 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11"
                    onClick={() => socialAuth("Google")}
                    disabled={status.loading}
                  >
                    <span className="grid size-5 place-items-center rounded-full border border-current text-xs font-semibold">
                      G
                    </span>
                    {authMode === "signup"
                      ? "Google Signup"
                      : "Continue with Google"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11"
                    onClick={() => socialAuth("GitHub")}
                    disabled={status.loading}
                  >
                    <span className="grid size-5 place-items-center rounded-full border border-current text-[10px] font-semibold">
                      GH
                    </span>
                    {authMode === "signup"
                      ? "GitHub Signup"
                      : "Continue with GitHub"}
                  </Button>
                </div>
              ) : null}

              <form className="grid gap-4" onSubmit={handleSubmit}>
                {authMode === "signup" ? (
                  <FormField
                    label="Name"
                    value={form.name}
                    onChange={(value) => updateForm("name", value)}
                    placeholder="Aarav Mehta"
                  />
                ) : null}
                {authMode !== "verify" ? (
                  <FormField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(value) => updateForm("email", value)}
                    placeholder="user@legaldesk.local"
                  />
                ) : null}
                {authMode !== "forgot" && authMode !== "verify" ? (
                  <PasswordField
                    label={authMode === "reset" ? "Reset Password" : "Password"}
                    value={form.password}
                    onChange={(value) => updateForm("password", value)}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                ) : null}
                {authMode === "signup" || authMode === "reset" ? (
                  <PasswordField
                    label="Confirm Password"
                    value={form.confirmPassword}
                    onChange={(value) => updateForm("confirmPassword", value)}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                ) : null}
                {authMode === "signup" || authMode === "reset" ? (
                  <PasswordStrength strength={strength} />
                ) : null}
                {authMode === "signup" ? (
                  <label className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={form.terms}
                      onChange={(event) =>
                        updateForm("terms", event.target.checked)
                      }
                      className="mt-0.5 size-4 accent-zinc-950 dark:accent-white"
                    />
                    <span>Accept Terms</span>
                  </label>
                ) : null}
                {authMode === "verify" ? (
                  <OtpInput otp={form.otp} updateOtp={updateOtp} />
                ) : null}

                <Button
                  type="submit"
                  className="h-11"
                  disabled={status.loading}
                >
                  {status.loading ? (
                    <>
                      <RefreshCw className="animate-spin" />
                      Loading State
                    </>
                  ) : (
                    <>
                      <LogIn />
                      {getAuthActionLabel(authMode)}
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
                {authMode === "login" ? (
                  <button
                    type="button"
                    onClick={() => onAuthModeChange("forgot")}
                    className="font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                  >
                    Forgot Password
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAuthModeChange("login")}
                    className="font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                  >
                    Already Have Account
                  </button>
                )}
                {authMode !== "signup" ? (
                  <button
                    type="button"
                    onClick={() => onAuthModeChange("signup")}
                    className="font-medium text-zinc-950 hover:underline dark:text-white"
                  >
                    Signup
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function validateAuth(authMode, form) {
  if (authMode === "signup" && !form.name.trim())
    return "Validation: name is required";
  if (authMode !== "verify" && !form.email.includes("@"))
    return "Validation: enter a valid email";
  if (
    authMode !== "forgot" &&
    authMode !== "verify" &&
    form.password.length < 8
  )
    return "Validation: password must contain at least 8 characters";
  if (
    (authMode === "signup" || authMode === "reset") &&
    form.password !== form.confirmPassword
  )
    return "Passwords do not match";
  if (authMode === "signup" && !form.terms)
    return "Validation: accept terms to continue";
  if (authMode === "verify" && form.otp.join("").length !== 6)
    return "Enter the 6 digit verification code";
  return "";
}

function getAuthActionLabel(authMode) {
  const labels = {
    login: "Sign In",
    signup: "Create Account",
    forgot: "Send Reset Link",
    reset: "Reset Password",
    verify: "Verify Email",
  };
  return labels[authMode] || "Continue";
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}
