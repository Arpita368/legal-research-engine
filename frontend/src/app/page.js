"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Archive,
  BarChart3,
  Bell,
  BookMarked,
  BookOpen,
  Bookmark,
  Bot,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  Copy,
  Database,
  Download,
  Eye,
  EyeOff,
  FileClock,
  FileDown,
  FileText,
  Filter,
  Gavel,
  Gauge,
  History,
  Home,
  KeyRound,
  Layers,
  LockKeyhole,
  LogIn,
  Menu,
  Mic,
  Moon,
  MoreHorizontal,
  PanelRightOpen,
  Plus,
  Printer,
  RefreshCw,
  Scale,
  Search,
  Send,
  Server,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Square,
  Sun,
  Table,
  ThumbsDown,
  ThumbsUp,
  Upload,
  User,
  Users,
  Volume2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const roles = ["Admin", "Student"];

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "chat", label: "Legal Assistant", icon: Bot },
  { id: "search", label: "Legal Search", icon: Search },
  { id: "memo", label: "Research Memo", icon: FileText },
  { id: "saved", label: "Saved Searches", icon: Archive },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "history", label: "History", icon: History },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "admin", label: "Admin", icon: ShieldCheck },
];

const dashboardStats = [
  {
    label: "Tasks Completed",
    value: "184",
    detail: "searches, memos and exports",
    icon: Check,
  },
  {
    label: "Research Searches",
    value: "126",
    detail: "38 saved for follow-up",
    icon: Search,
  },
  {
    label: "Memos Drafted",
    value: "42",
    detail: "18 reviewed this month",
    icon: FileText,
  },
  {
    label: "Sources Reviewed",
    value: "316",
    detail: "citation records opened",
    icon: BookMarked,
  },
];

const recentSearches = [
  "Execution of foreign commercial decrees in India",
  "Section 34 waiver after partial award payment",
  "Specific performance in infrastructure contracts",
  "Commercial Courts Act urgent interim relief",
];

const recentMemos = [
  {
    title: "Arbitration award challenge after settlement",
    date: "Jul 30, 2026",
    status: "Draft",
  },
  {
    title: "Maintainability under Article 226 in contract disputes",
    date: "Jul 29, 2026",
    status: "Reviewed",
  },
  {
    title: "Limitation for execution of foreign judgment",
    date: "Jul 28, 2026",
    status: "Exported",
  },
];

const latestJudgments = [
  {
    title: "M/s. Precision Infrastructure v. State Trading Corp.",
    court: "Supreme Court of India",
    date: "2026-07-18",
    citation: "2026 INSC 184",
  },
  {
    title: "Eastern Logistics Ltd. v. Union of India",
    court: "Supreme Court of India",
    date: "2026-07-11",
    citation: "2026 INSC 177",
  },
  {
    title: "Apex Steel Works v. Nova Finance",
    court: "Supreme Court of India",
    date: "2026-07-04",
    citation: "2026 INSC 169",
  },
];

const taskProgress = [
  {
    label: "Research queue",
    value: 76,
    detail: "19 of 25 active tasks completed",
  },
  {
    label: "Memo workflow",
    value: 68,
    detail: "17 drafts moved to review",
  },
  {
    label: "Source validation",
    value: 84,
    detail: "63 cited sources checked",
  },
];

const taskHighlights = [
  "9 searches completed today",
  "4 memos updated this week",
  "12 bookmarks added",
  "7 exports generated",
];

const searchResults = [
  {
    title: "Renusagar Power Co. Ltd. v. General Electric Co.",
    court: "Supreme Court of India",
    citation: "1994 Supp (1) SCC 644",
    summary:
      "Public policy objections to enforcement are construed narrowly in foreign award enforcement, with emphasis on finality and commercial certainty.",
    holdings: [
      "Foreign award enforcement can be refused only on limited statutory grounds.",
      "Patent illegality review is not imported into the foreign award stage.",
    ],
    paragraphs: "Paras 35, 66, 76",
    sections: "Arbitration and Conciliation Act, 1996, Sections 48 and 49",
  },
  {
    title: "Ssangyong Engineering v. NHAI",
    court: "Supreme Court of India",
    citation: "(2019) 15 SCC 131",
    summary:
      "Clarifies post-2015 public policy review and separates jurisdictional defects from merits reappreciation in arbitral award challenges.",
    holdings: [
      "Awards cannot be set aside for mere erroneous application of law.",
      "Natural justice defects remain reviewable under Section 34.",
    ],
    paragraphs: "Paras 34, 41, 76",
    sections: "Arbitration and Conciliation Act, 1996, Section 34",
  },
  {
    title: "Booz Allen & Hamilton Inc. v. SBI Home Finance Ltd.",
    court: "Supreme Court of India",
    citation: "(2011) 5 SCC 532",
    summary:
      "Draws the boundary between arbitrable rights in personam and non-arbitrable rights in rem for civil and commercial disputes.",
    holdings: [
      "Commercial contractual disputes are generally arbitrable.",
      "Actions involving public status or rights in rem are excluded.",
    ],
    paragraphs: "Paras 22, 36, 38",
    sections: "Arbitration and Conciliation Act, 1996, Sections 8 and 11",
  },
];

const chatSources = [
  {
    caseName: "Ssangyong Engineering v. NHAI",
    court: "Supreme Court of India",
    citation: "(2019) 15 SCC 131",
    paragraph: "Para 41",
    statute: "Arbitration and Conciliation Act, 1996, Section 34",
    article: "Article 136",
    date: "2019-05-08",
    confidence: "94%",
  },
  {
    caseName: "Associate Builders v. DDA",
    court: "Supreme Court of India",
    citation: "(2015) 3 SCC 49",
    paragraph: "Paras 28-31",
    statute: "Arbitration and Conciliation Act, 1996, Section 34",
    article: "Article 142",
    date: "2014-11-25",
    confidence: "91%",
  },
  {
    caseName: "Renusagar Power Co. Ltd. v. General Electric Co.",
    court: "Supreme Court of India",
    citation: "1994 Supp (1) SCC 644",
    paragraph: "Para 66",
    statute: "Arbitration and Conciliation Act, 1996, Section 48",
    article: "Article 141",
    date: "1993-10-07",
    confidence: "88%",
  },
];

const memoSections = [
  {
    title: "Question",
    content:
      "Whether a party that accepts partial payment under an arbitral award can still challenge the remaining award under Section 34.",
  },
  {
    title: "Applicable Laws",
    content:
      "Arbitration and Conciliation Act, 1996, Sections 34, 35 and 36; Indian Contract Act, 1872, Sections 63 and 65.",
  },
  {
    title: "Relevant Cases",
    content:
      "Ssangyong Engineering v. NHAI; Associate Builders v. DDA; National Highways Authority of India v. M. Hakeem.",
  },
  {
    title: "Case Analysis",
    content:
      "Acceptance of a severable, undisputed amount is not by itself a waiver unless the conduct shows full satisfaction or an election inconsistent with challenge.",
  },
  {
    title: "Court Reasoning",
    content:
      "Courts separate finality of awards from limited statutory review, and examine whether the challenge attacks jurisdiction, natural justice or patent illegality.",
  },
  {
    title: "Arguments",
    content:
      "The challenger can argue severability, absence of accord and satisfaction, and preservation of rights before accepting payment.",
  },
  {
    title: "Counter Arguments",
    content:
      "The respondent can argue approbate and reprobate, waiver, estoppel and commercial finality where acceptance was unconditional.",
  },
  {
    title: "Conclusion",
    content:
      "A challenge can remain maintainable if acceptance was qualified, partial and not inconsistent with the relief sought under Section 34.",
  },
  {
    title: "References",
    content:
      "Paragraph-level sources should be attached to each proposition before export.",
  },
];

const adminTabs = [
  "Datasets",
  "Users",
  "Search Logs",
  "Analytics",
  "Monitoring",
  "Settings",
];

const libraryItems = {
  saved: {
    title: "Saved Searches",
    icon: Archive,
    rows: [
      "Foreign judgment execution and limitation",
      "Commercial Courts Act jurisdiction threshold",
      "Arbitrability of fraud in commercial contracts",
      "Constitutional writs in tender disputes",
    ],
  },
  bookmarks: {
    title: "Bookmarks",
    icon: Bookmark,
    rows: [
      "Booz Allen & Hamilton Inc. v. SBI Home Finance Ltd.",
      "Ssangyong Engineering v. NHAI",
      "Renusagar Power Co. Ltd. v. General Electric Co.",
      "Associate Builders v. DDA",
    ],
  },
  history: {
    title: "History",
    icon: History,
    rows: [
      "Opened source viewer for Section 34 cases",
      "Downloaded memo draft",
      "Rebuilt semantic search filters",
      "Viewed dataset status",
    ],
  },
  notifications: {
    title: "Notifications",
    icon: Bell,
    rows: [
      "Volume 7 Part 1 indexing completed",
      "Two memos are waiting for source validation",
      "BM25 rebuild scheduled",
      "New admin upload requires review",
    ],
  },
};

export default function LegalResearchApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [theme, setTheme] = useState("dark");
  const [role, setRole] = useState("Admin");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSource, setActiveSource] = useState(chatSources[0]);
  const [authMode, setAuthMode] = useState("login");

  const openView = (view) => {
    setActiveView(view);
    setMobileNavOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <AuthExperience
        authMode={authMode}
        onAuthModeChange={setAuthMode}
        onAuthenticated={(nextRole) => {
          setRole(nextRole);
          setIsAuthenticated(true);
          setActiveView("dashboard");
        }}
        role={role}
        setRole={setRole}
      />
    );
  }

  return (
    <div
      className={`${
        theme === "dark" ? "dark" : ""
      } min-h-screen glass-app text-zinc-950 dark:text-white`}
    >
      <div className="flex min-h-screen">
        <Sidebar activeView={activeView} onOpenView={openView} role={role} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav
            role={role}
            setRole={setRole}
            theme={theme}
            setTheme={setTheme}
            onMenu={() => setMobileNavOpen(true)}
          />

          {mobileNavOpen ? (
            <div className="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-sm lg:hidden">
              <div className="glass-sidebar h-full w-72 border-r border-white/50 p-3 text-zinc-950 shadow-2xl dark:border-white/10 dark:text-white">
                <div className="mb-3 flex items-center justify-between">
                  <BrandMark />
                  <Button
                    aria-label="Close navigation"
                    size="icon"
                    variant="ghost"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <X />
                  </Button>
                </div>
                <NavList
                  items={sidebarItems}
                  activeView={activeView}
                  onOpenView={openView}
                />
              </div>
            </div>
          ) : null}

          <main className="min-w-0 flex-1 overflow-hidden">
            {renderView({
              activeView,
              role,
              setRole,
              activeSource,
              setActiveSource,
              theme,
              setTheme,
            })}
          </main>
        </div>
      </div>
    </div>
  );
}

function renderView(props) {
  const { activeView } = props;

  if (activeView === "dashboard") {
    return <DashboardView />;
  }

  if (activeView === "search") {
    return <LegalSearchView />;
  }

  if (activeView === "chat") {
    return (
      <AIChatView
        activeSource={props.activeSource}
        setActiveSource={props.setActiveSource}
      />
    );
  }

  if (activeView === "memo") {
    return <ResearchMemoView />;
  }

  if (activeView === "profile") {
    return <ProfileView role={props.role} setRole={props.setRole} />;
  }

  if (activeView === "settings") {
    return (
      <SettingsView
        theme={props.theme}
        setTheme={props.setTheme}
        role={props.role}
      />
    );
  }

  if (activeView === "admin") {
    return <AdminView role={props.role} setRole={props.setRole} />;
  }

  return <LibraryView type={activeView} />;
}

function AuthExperience({
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateAuth(authMode, form);

    if (validation) {
      setStatus({ type: "error", message: validation, loading: false });
      return;
    }

    setStatus({ type: "loading", message: "Checking your details", loading: true });

    window.setTimeout(() => {
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

      setStatus({
        type: "success",
        message: "Sign in complete. Opening dashboard",
        loading: false,
      });
      window.setTimeout(() => onAuthenticated(role), 450);
    }, 700);
  };

  const socialAuth = (provider) => {
    setStatus({
      type: "loading",
      message: `Connecting with ${provider}`,
      loading: true,
    });
    window.setTimeout(() => {
      setStatus({
        type: "success",
        message: `${provider} sign in complete. Opening dashboard`,
        loading: false,
      });
      window.setTimeout(() => onAuthenticated(role), 350);
    }, 650);
  };

  return (
    <div className="min-h-screen glass-app text-zinc-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_520px]">
        <section className="hidden border-r border-white/15 bg-zinc-950/75 text-white backdrop-blur-2xl lg:block">
          <div className="flex h-full flex-col justify-between p-10">
            <div>
              <BrandMark inverse />
              <div className="mt-12 max-w-3xl">
                <p className="text-sm text-zinc-400">Commercial Courts Research Engine</p>
                <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight">
                  Citation grounded research for litigation teams.
                </h1>
              </div>
            </div>

            <div className="grid gap-3">
              <AuthReadinessRow icon={KeyRound} label="Secure sign in" />
              <AuthReadinessRow icon={LockKeyhole} label="Private workspace" />
              <AuthReadinessRow icon={ShieldCheck} label="Verified research access" />
              <AuthReadinessRow icon={Server} label="Dataset health visible" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                {roles.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className={`h-10 rounded-lg border text-xs font-medium backdrop-blur-xl transition ${
                      role === item
                        ? "border-white bg-white/90 text-zinc-950"
                        : "border-white/15 bg-white/10 text-zinc-300 hover:border-white/35 hover:bg-white/15"
                    }`}
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
              <AuthHeader authMode={authMode} onAuthModeChange={onAuthModeChange} />

              {status.type !== "idle" ? (
                <StatusBanner status={status} />
              ) : null}

              {(authMode === "login" || authMode === "signup") ? (
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
                    {authMode === "signup" ? "Google Signup" : "Continue with Google"}
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
                    {authMode === "signup" ? "GitHub Signup" : "Continue with GitHub"}
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

                {(authMode === "signup" || authMode === "reset") ? (
                  <PasswordField
                    label="Confirm Password"
                    value={form.confirmPassword}
                    onChange={(value) => updateForm("confirmPassword", value)}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                ) : null}

                {(authMode === "signup" || authMode === "reset") ? (
                  <PasswordStrength strength={strength} />
                ) : null}

                {authMode === "signup" ? (
                  <label className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={form.terms}
                      onChange={(event) => updateForm("terms", event.target.checked)}
                      className="mt-0.5 size-4 accent-zinc-950 dark:accent-white"
                    />
                    <span>Accept Terms</span>
                  </label>
                ) : null}

                {authMode === "verify" ? (
                  <OtpInput otp={form.otp} updateOtp={updateOtp} />
                ) : null}

                <Button type="submit" className="h-11" disabled={status.loading}>
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
  if (authMode === "signup" && !form.name.trim()) {
    return "Validation: name is required";
  }

  if (authMode !== "verify" && !form.email.includes("@")) {
    return "Validation: enter a valid email";
  }

  if (authMode !== "forgot" && authMode !== "verify" && form.password.length < 8) {
    return "Validation: password must contain at least 8 characters";
  }

  if (
    (authMode === "signup" || authMode === "reset") &&
    form.password !== form.confirmPassword
  ) {
    return "Passwords do not match";
  }

  if (authMode === "signup" && !form.terms) {
    return "Validation: accept terms to continue";
  }

  if (authMode === "verify" && form.otp.join("").length !== 6) {
    return "Enter the 6 digit verification code";
  }

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

function AuthHeader({ authMode, onAuthModeChange }) {
  const title = {
    login: "Login",
    signup: "SIGNUP",
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
            className={`h-9 rounded-md text-sm font-medium transition ${
              authMode === mode
                ? "bg-teal-950 text-white dark:bg-teal-100 dark:text-teal-950"
                : "text-zinc-600 hover:bg-white/45 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
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
      className={`mb-4 flex items-center gap-3 rounded-lg border p-3 text-sm backdrop-blur-xl ${
        status.type === "error"
          ? "border-rose-300/70 bg-rose-50/70 text-rose-950 dark:border-rose-300/25 dark:bg-rose-400/10 dark:text-rose-100"
          : "border-white/60 bg-white/45 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-200"
      }`}
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
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
            className={`h-2 rounded-sm ${
              step <= strength
                ? "bg-zinc-950 dark:bg-white"
                : "bg-zinc-200 dark:bg-zinc-800"
            }`}
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

function BrandMark({ inverse = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`grid size-10 place-items-center rounded-lg border ${
          inverse
            ? "border-white bg-white text-teal-950"
            : "border-teal-950 bg-teal-950 text-white dark:border-teal-100 dark:bg-teal-100 dark:text-teal-950"
        }`}
      >
        <Scale className="size-5" />
      </div>
      <div>
        <div className="text-sm font-semibold">Legal Research Engine</div>
        <div className={`text-xs ${inverse ? "text-zinc-400" : "text-zinc-500"}`}>
          Commercial Courts Workspace
        </div>
      </div>
    </div>
  );
}

function Sidebar({ activeView, onOpenView, role }) {
  return (
    <aside className="glass-sidebar hidden w-72 shrink-0 border-r border-white/50 p-3 dark:border-white/10 lg:flex lg:flex-col">
      <div className="p-2">
        <BrandMark />
      </div>
      <div className="mt-5 flex-1 overflow-y-auto pr-1">
        <NavList items={sidebarItems} activeView={activeView} onOpenView={onOpenView} />
      </div>
      <div className="glass-card mt-5 rounded-lg p-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-teal-950 text-white dark:bg-teal-100 dark:text-teal-950">
            <CircleUserRound className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">Aditya Kandle</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">{role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavList({ items, activeView, onOpenView }) {
  return (
    <nav className="grid gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeView === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpenView(item.id)}
            className={`flex h-10 items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition ${
              active
                ? "bg-teal-950 text-white shadow-sm dark:bg-teal-100 dark:text-teal-950"
                : "text-zinc-600 hover:bg-white/55 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
          >
            <Icon className="size-4" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function TopNav({ role, setRole, theme, setTheme, onMenu }) {
  return (
    <header className="glass-topbar sticky top-0 z-30 border-b border-white/45 px-3 py-3 backdrop-blur-2xl dark:border-white/10 sm:px-5">
      <div className="flex items-center gap-3">
        <Button
          aria-label="Open navigation"
          size="icon"
          variant="ghost"
          className="lg:hidden"
          onClick={onMenu}
        >
          <Menu />
        </Button>

        <div className="glass-input hidden min-w-0 flex-1 items-center gap-2 rounded-lg px-3 sm:flex">
          <Search className="size-4 text-zinc-500" />
          <input
            aria-label="Search"
            placeholder="Search cases, statutes, memos"
            className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
          />
        </div>

        <Button aria-label="Notifications" title="Notifications" variant="outline" size="icon">
          <Bell />
        </Button>
        <Button
          aria-label="Theme Toggle"
          title="Theme Toggle"
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
        <RoleSelect role={role} setRole={setRole} />
      </div>
    </header>
  );
}

function RoleSelect({ role, setRole, compact = false }) {
  return (
    <label className="relative">
      <span className="sr-only">Role</span>
      <select
        value={role}
        onChange={(event) => setRole(event.target.value)}
        className={`glass-input appearance-none rounded-lg text-sm font-medium outline-none ${
          compact ? "h-9 px-3 pr-8" : "h-10 px-3 pr-8"
        }`}
      >
        {roles.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
    </label>
  );
}

function PageShell({ title, eyebrow, actions, children }) {
  return (
    <section className="h-full overflow-y-auto">
      <div className="mx-auto grid max-w-7xl gap-5 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{eyebrow}</p>
            <h1 className="mt-1 text-3xl font-semibold">{title}</h1>
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function DashboardView() {
  return (
    <PageShell
      title="Task Dashboard"
      eyebrow="Workspace overview"
      actions={
        <>
          <Button variant="outline">
            <Download />
            Export Activity
          </Button>
          <Button>
            <Plus />
            New Memo
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <MetricCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <Panel title="Recent Searches" icon={Search}>
          <div className="grid gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={search}
                type="button"
                className="glass-row flex items-center justify-between rounded-lg p-3 text-left text-sm transition hover:border-teal-600/45 dark:hover:border-teal-200/25"
              >
                <span>{search}</span>
                <span className="text-xs text-zinc-500">#{index + 1}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Recent Memos" icon={FileText}>
          <div className="grid gap-3">
            {recentMemos.map((memo) => (
              <div
                key={memo.title}
                className="glass-row rounded-lg p-3"
              >
                <div className="text-sm font-semibold">{memo.title}</div>
                <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{memo.date}</span>
                  <span>{memo.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.2fr)]">
        <Panel title="Task Completion" icon={ClipboardList}>
          <div className="grid gap-3">
            {taskProgress.map((item) => (
              <div
                key={item.label}
                className="glass-row rounded-lg p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 rounded-sm bg-zinc-950/10 dark:bg-white/10">
                  <div
                    className="h-2 rounded-sm bg-teal-700 dark:bg-teal-200"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {item.detail}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2">
              {taskHighlights.map((item) => (
                <div
                  key={item}
                  className="glass-card rounded-lg p-3 text-center text-xs font-semibold"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Latest Judgments" icon={Gavel}>
          <div className="grid gap-3">
            {latestJudgments.map((judgment) => (
              <div
                key={judgment.citation}
                className="glass-row grid gap-3 rounded-lg p-4 md:grid-cols-[minmax(0,1fr)_150px]"
              >
                <div>
                  <div className="font-semibold">{judgment.title}</div>
                  <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {judgment.court} | {judgment.citation}
                  </div>
                </div>
                <div className="text-left text-sm font-medium md:text-right">{judgment.date}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}

function MetricCard({ stat }) {
  const Icon = stat.icon;

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {stat.label}
        </div>
        <Icon className="size-5 text-zinc-500 dark:text-zinc-400" />
      </div>
      <div className="mt-5 text-3xl font-semibold text-teal-950 dark:text-teal-100">
        {stat.value}
      </div>
      <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{stat.detail}</div>
    </div>
  );
}

function LegalSearchView() {
  const [semantic, setSemantic] = useState(true);
  const [infiniteScroll, setInfiniteScroll] = useState(false);

  return (
    <PageShell
      title="Legal Search"
      eyebrow="Dedicated legal database search"
      actions={
        <>
          <Button variant="outline">
            <Filter />
            Advanced Filters
          </Button>
          <Button>
            <Search />
            Search
          </Button>
        </>
      }
    >
      <div className="glass-panel rounded-lg p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="glass-input flex min-h-14 flex-1 items-center gap-3 rounded-lg px-4">
            <Search className="size-5 text-zinc-500" />
            <input
              aria-label="Large Search Bar"
              defaultValue="Can an arbitral award be challenged after accepting partial payment?"
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-zinc-500"
            />
          </div>
          <Button className="h-14 px-5">
            <SlidersHorizontal />
            Run Hybrid Search
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Court",
            "Judge",
            "Year",
            "Citation",
            "Statute",
            "Article",
            "Case Type",
            "Keyword",
          ].map((filter) => (
            <label key={filter} className="grid gap-2 text-sm font-medium">
              <span>{filter}</span>
              <input
                placeholder={filter}
                className="glass-input h-10 rounded-lg px-3 text-sm outline-none placeholder:text-zinc-400 focus:border-teal-600/50 dark:placeholder:text-zinc-600 dark:focus:border-teal-200/40"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Toggle checked={semantic} onChange={setSemantic} label="Semantic Search Toggle" />
          <Toggle checked={infiniteScroll} onChange={setInfiniteScroll} label="Infinite Scroll" />
          <label className="ml-auto flex items-center gap-2 text-sm font-medium">
            <span>Sorting</span>
            <select className="glass-input h-9 rounded-lg px-3 text-sm outline-none">
              <option>Most relevant</option>
              <option>Newest first</option>
              <option>Highest confidence</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4">
        {searchResults.map((result) => (
          <CaseCard key={result.citation} result={result} />
        ))}
      </div>

      <div className="glass-row flex flex-wrap items-center justify-between gap-3 rounded-lg p-3">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Pagination | Page 1 of 18
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ChevronLeft />
            Previous
          </Button>
          <Button variant="outline">
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

function CaseCard({ result }) {
  return (
    <article className="glass-card rounded-lg p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{result.title}</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span>{result.court}</span>
            <span>|</span>
            <span>{result.citation}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Bookmark />
            Bookmark
          </Button>
          <Button variant="outline" size="sm">
            <Download />
            Download
          </Button>
          <Button size="sm">Open</Button>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {result.summary}
      </p>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <InfoBlock title="Key Holdings" icon={BookMarked}>
          <ul className="grid gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            {result.holdings.map((holding) => (
              <li key={holding} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0" />
                <span>{holding}</span>
              </li>
            ))}
          </ul>
        </InfoBlock>
        <InfoBlock title="Paragraphs" icon={FileClock}>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{result.paragraphs}</p>
        </InfoBlock>
        <InfoBlock title="Relevant Sections" icon={ClipboardList}>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{result.sections}</p>
        </InfoBlock>
      </div>
    </article>
  );
}

function AIChatView({ activeSource, setActiveSource }) {
  const [message, setMessage] = useState("");

  return (
    <section className="grid h-[calc(100vh-65px)] min-h-0 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
      <aside className="glass-sidebar hidden border-r border-white/50 p-3 dark:border-white/10 lg:block">
        <Button className="mb-3 w-full justify-start">
          <Plus />
          New Conversation
        </Button>
        <div className="grid gap-2">
          {[
            "Award challenge after payment",
            "Foreign decree enforcement",
            "Tender writ maintainability",
            "Specific performance limits",
          ].map((conversation, index) => (
            <button
              key={conversation}
              type="button"
              className={`rounded-lg border p-3 text-left text-sm ${
                index === 0
                  ? "border-teal-700/50 bg-white/70 dark:border-teal-200/30 dark:bg-white/10"
                  : "border-white/50 bg-white/35 hover:border-teal-600/45 dark:border-white/10 dark:bg-white/5 dark:hover:border-teal-200/25"
              }`}
            >
              <div className="font-medium">{conversation}</div>
              <div className="mt-1 text-xs text-zinc-500">Conversation List</div>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex min-h-0 flex-col">
        <div className="border-b border-white/45 p-4 dark:border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">Legal Assistant</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Citation-first legal research workspace
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" title="Read Answer">
                <Volume2 />
              </Button>
              <Button variant="outline" size="icon" title="Source Panel">
                <PanelRightOpen />
              </Button>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="mx-auto grid max-w-3xl gap-5">
            <ChatBubble speaker="You">
              Can an arbitral award be challenged after accepting partial payment?
            </ChatBubble>
            <ChatBubble speaker="Assistant" variant="answer">
              <div className="grid gap-4">
                <p>
                  Yes, a Section 34 challenge may remain maintainable where the
                  accepted payment is severable, qualified and not treated as full
                  satisfaction of the award.
                </p>
                <div className="overflow-hidden rounded-lg border border-white/50 dark:border-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/45 dark:bg-white/10">
                      <tr>
                        <th className="p-3 font-semibold">Issue</th>
                        <th className="p-3 font-semibold">Likely Test</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-white/45 dark:border-white/10">
                        <td className="p-3">Partial payment</td>
                        <td className="p-3">Severability and reservation of rights</td>
                      </tr>
                      <tr className="border-t border-white/45 dark:border-white/10">
                        <td className="p-3">Waiver</td>
                        <td className="p-3">Clear election or accord and satisfaction</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <pre className="glass-row overflow-x-auto rounded-lg p-3 text-xs">
                  <code>{`memo.issue = "Section 34 maintainability";
memo.sources.required = true;`}</code>
                </pre>
                <SourceStrip sources={chatSources} onOpen={setActiveSource} />
              </div>
            </ChatBubble>

            <div className="glass-row flex flex-wrap items-center gap-2 rounded-lg p-2">
              <span className="px-2 text-sm text-zinc-500">Streaming Responses</span>
              <TypingDots />
              <Button variant="outline" size="sm">
                <Square />
                Stop Generation
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw />
                Regenerate
              </Button>
              <IconAction icon={Copy} label="Copy" />
              <IconAction icon={ThumbsUp} label="Like" />
              <IconAction icon={ThumbsDown} label="Dislike" />
              <Button variant="outline" size="sm">
                <FileDown />
                Download Memo
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/45 p-4 dark:border-white/10">
          <div className="mx-auto grid max-w-3xl gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                "Draft a memo",
                "Compare cases",
                "Find paragraph citations",
                "Extract statutory issues",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setMessage(suggestion)}
                  className="glass-row rounded-lg px-3 py-2 text-sm hover:border-teal-600/45 dark:hover:border-teal-200/25"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="glass-panel flex items-end gap-2 rounded-lg p-2">
              <Button variant="ghost" size="icon" title="Upload PDF">
                <Upload />
              </Button>
              <textarea
                aria-label="Bottom Chat Input"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask a legal research question"
                rows={1}
                className="max-h-36 min-h-10 min-w-0 flex-1 resize-y bg-transparent py-2 text-sm outline-none placeholder:text-zinc-500"
              />
              <Button variant="ghost" size="icon" title="Voice Input">
                <Mic />
              </Button>
              <Button size="icon" title="Send Button">
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SourcePanel activeSource={activeSource} setActiveSource={setActiveSource} />
    </section>
  );
}

function ChatBubble({ speaker, variant = "question", children }) {
  const isAnswer = variant === "answer";

  return (
    <div className={`flex gap-3 ${isAnswer ? "" : "justify-end"}`}>
      {isAnswer ? (
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-teal-950 text-white dark:bg-teal-100 dark:text-teal-950">
          <Bot className="size-5" />
        </div>
      ) : null}
      <div
        className={`max-w-[88%] rounded-lg border p-4 text-sm leading-6 ${
          isAnswer
            ? "glass-card"
            : "border-teal-950 bg-teal-950 text-white shadow-lg shadow-teal-950/10 dark:border-teal-100 dark:bg-teal-100 dark:text-teal-950"
        }`}
      >
        <div className="mb-2 text-xs font-semibold opacity-70">{speaker}</div>
        {children}
      </div>
    </div>
  );
}

function SourceStrip({ sources, onOpen }) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-semibold">Sources</div>
      <div className="grid gap-2">
        {sources.map((source) => (
          <button
            key={`${source.caseName}-${source.paragraph}`}
            type="button"
            onClick={() => onOpen(source)}
            className="glass-row rounded-lg p-3 text-left text-xs hover:border-teal-600/45 dark:hover:border-teal-200/25"
          >
            <div className="font-semibold">{source.caseName}</div>
            <div className="mt-1 text-zinc-500">
              {source.citation} | {source.paragraph} | Confidence {source.confidence}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SourcePanel({ activeSource, setActiveSource }) {
  return (
    <aside className="glass-sidebar hidden min-h-0 border-l border-white/50 p-4 dark:border-white/10 lg:block">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Source Panel</h2>
          <p className="text-sm text-zinc-500">Every answer includes sources</p>
        </div>
        <Button variant="ghost" size="icon" title="More">
          <MoreHorizontal />
        </Button>
      </div>

      <div className="grid gap-3">
        {chatSources.map((source) => (
          <button
            key={source.caseName}
            type="button"
            onClick={() => setActiveSource(source)}
            className={`rounded-lg border p-3 text-left text-sm transition ${
              activeSource?.caseName === source.caseName
                ? "border-teal-700/50 bg-white/70 dark:border-teal-200/30 dark:bg-white/10"
                : "border-white/50 bg-white/35 hover:border-teal-600/45 dark:border-white/10 dark:bg-white/5 dark:hover:border-teal-200/25"
            }`}
          >
            <div className="font-semibold">{source.caseName}</div>
            <div className="mt-2 text-xs text-zinc-500">
              {source.court} | {source.citation}
            </div>
          </button>
        ))}
      </div>

      {activeSource ? (
        <div className="glass-card mt-4 rounded-lg p-4">
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <BookOpen className="size-4" />
            Source Viewer
          </div>
          <SourceDetail label="Case Name" value={activeSource.caseName} />
          <SourceDetail label="Court" value={activeSource.court} />
          <SourceDetail label="Citation" value={activeSource.citation} />
          <SourceDetail label="Paragraph Number" value={activeSource.paragraph} />
          <SourceDetail label="Applicable Statute" value={activeSource.statute} />
          <SourceDetail label="Constitution Article" value={activeSource.article} />
          <SourceDetail label="Judgment Date" value={activeSource.date} />
          <SourceDetail label="Confidence Score" value={activeSource.confidence} />
        </div>
      ) : null}
    </aside>
  );
}

function SourceDetail({ label, value }) {
  return (
    <div className="border-t border-white/45 py-2 text-sm first:border-t-0 dark:border-white/10">
      <div className="text-xs font-medium text-zinc-500">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}

function ResearchMemoView() {
  return (
    <PageShell
      title="Research Memo"
      eyebrow="Professional memo layout"
      actions={
        <>
          <Button variant="outline">
            <FileDown />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download />
            Export DOCX
          </Button>
          <Button>
            <Printer />
            Print
          </Button>
        </>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4">
          {memoSections.map((section) => (
            <section
              key={section.title}
              className="glass-card rounded-lg p-4"
            >
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <aside className="glass-panel h-fit rounded-lg p-4">
          <h2 className="font-semibold">Memo Controls</h2>
          <div className="mt-4 grid gap-2">
            {["Question", "Applicable Laws", "Relevant Cases", "Case Analysis"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className="glass-row flex items-center justify-between rounded-lg p-3 text-sm font-medium hover:border-teal-600/45 dark:hover:border-teal-200/25"
                >
                  {item}
                  <ChevronRight className="size-4" />
                </button>
              ),
            )}
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function ProfileView({ role, setRole }) {
  return (
    <PageShell title="Profile" eyebrow="User Details">
      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel title="User Details" icon={CircleUserRound}>
          <div className="flex items-center gap-4">
            <div className="grid size-20 place-items-center rounded-lg bg-teal-950 text-white dark:bg-teal-100 dark:text-teal-950">
              <User className="size-9" />
            </div>
            <div>
              <div className="text-xl font-semibold">Aditya Kandle</div>
              <div className="mt-1 text-sm text-zinc-500">aditya@legalresearch.local</div>
              <div className="mt-3">
                <RoleSelect role={role} setRole={setRole} />
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <ProfileRow label="Role" value={role} />
            <ProfileRow label="Organization" value="Commercial Litigation Lab" />
            <ProfileRow label="Activity" value="184 searches this month" />
            <ProfileRow label="Usage" value="74 percent workspace quota" />
          </div>
        </Panel>

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="API Keys" icon={KeyRound}>
            <SettingsRows rows={["Production key active", "Test key restricted", "Last rotated Jul 29"]} />
          </Panel>
          <Panel title="Sessions" icon={ShieldCheck}>
            <SettingsRows rows={["Current device", "Chrome on Windows", "2 active sessions"]} />
          </Panel>
          <Panel title="Security" icon={LockKeyhole}>
            <SettingsRows rows={["MFA ready", "Password updated", "Secure session active"]} />
          </Panel>
          <Panel title="Avatar" icon={User}>
            <SettingsRows rows={["Black and white initials", "Organization badge", "Profile verified"]} />
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-t border-white/45 pt-3 dark:border-white/10">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function SettingsView({ theme, setTheme, role }) {
  return (
    <PageShell title="Settings" eyebrow="Workspace preferences">
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Theme" icon={theme === "dark" ? Moon : Sun}>
          <div className="glass-row flex items-center justify-between rounded-lg p-3">
            <span className="text-sm font-medium">Black and white theme</span>
            <Toggle
              checked={theme === "dark"}
              onChange={(checked) => setTheme(checked ? "dark" : "light")}
              label={theme === "dark" ? "Dark" : "Light"}
            />
          </div>
        </Panel>
        <Panel title="Language" icon={BookOpen}>
          <SettingsRows rows={["English", "Indian legal corpus", "Neutral date format"]} />
        </Panel>
        <Panel title="Notifications" icon={Bell}>
          <SettingsRows rows={["Judgment uploads", "Memo exports", "Index health"]} />
        </Panel>
        <Panel title="Voice" icon={Mic}>
          <SettingsRows rows={["Voice input ready", "Voice output ready", "Transcript retention off"]} />
        </Panel>
        <Panel title="Accessibility" icon={Eye}>
          <SettingsRows rows={["High contrast", "Large hit targets", "Reduced motion ready"]} />
        </Panel>
        <Panel title="Privacy" icon={ShieldCheck}>
          <SettingsRows rows={["Private workspace", "Source logs retained", `Current role: ${role}`]} />
        </Panel>
        <Panel title="API Keys" icon={KeyRound}>
          <SettingsRows rows={["Masked by default", "Scoped permissions", "Revocation ready"]} />
        </Panel>
      </div>
    </PageShell>
  );
}

function SettingsRows({ rows }) {
  return (
    <div className="grid gap-2">
      {rows.map((row) => (
        <div
          key={row}
          className="glass-row flex items-center justify-between rounded-lg p-3 text-sm"
        >
          <span>{row}</span>
          <Check className="size-4" />
        </div>
      ))}
    </div>
  );
}

function AdminView({ role, setRole }) {
  const [activeTab, setActiveTab] = useState("Datasets");

  if (role !== "Admin") {
    return (
      <PageShell title="Admin" eyebrow="Workspace control">
        <div className="glass-panel rounded-lg p-8 text-center">
          <LockKeyhole className="mx-auto size-10" />
          <h2 className="mt-4 text-xl font-semibold">Admin access required</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            Switch to Admin to manage datasets, users and workspace activity.
          </p>
          <Button className="mt-5" onClick={() => setRole("Admin")}>
            Switch to Admin
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Admin Panel"
      eyebrow="Workspace control center"
      actions={
        <>
          <Button variant="outline">
            <RefreshCw />
            Reindex
          </Button>
          <Button>
            <Database />
            Rebuild Index
          </Button>
        </>
      }
    >
      <div className="glass-panel grid gap-2 rounded-lg p-2 md:grid-cols-6">
        {adminTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`h-10 rounded-md text-sm font-medium transition ${
              activeTab === tab
                ? "bg-teal-950 text-white dark:bg-teal-100 dark:text-teal-950"
                : "text-zinc-600 hover:bg-white/55 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Dataset Management" icon={Database}>
          <div className="grid gap-4">
            <div className="glass-row grid min-h-48 place-items-center rounded-lg border-dashed p-6 text-center">
              <div>
                <Upload className="mx-auto size-10 text-zinc-500" />
                <h2 className="mt-3 font-semibold">Drag & Drop</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Upload Judgments, Upload Statutes, Upload Constitution
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["CSV", "PDF", "DOCX", "Bulk Upload"].map((item) => (
                    <span
                      key={item}
                      className="glass-chip rounded-lg px-3 py-2 text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-medium">
                <span>Progress</span>
                <span>68%</span>
              </div>
              <div className="h-2 rounded-sm bg-zinc-950/10 dark:bg-white/10">
                <div className="h-2 w-[68%] rounded-sm bg-teal-700 dark:bg-teal-200" />
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Index Status" icon={Gauge}>
          <div className="grid gap-3">
            <AdminStatus label="Vector Count" value="428,912" icon={Layers} />
            <AdminStatus label="BM25 Status" value="Ready" icon={Table} />
            <AdminStatus label="Search Logs" value="18,204" icon={FileClock} />
            <AdminStatus label="Monitoring" value="Healthy" icon={Server} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Users" icon={Users}>
          <SettingsRows rows={["Admin: 4", "Student: 87"]} />
        </Panel>
        <Panel title="Analytics" icon={BarChart3}>
          <SettingsRows rows={["Peak usage: 2 PM", "Top query: arbitration", "Memo exports: 42"]} />
        </Panel>
        <Panel title="Settings" icon={Settings}>
          <SettingsRows rows={["Dataset lock on", "Audit log on", "Rebuild requires Admin"]} />
        </Panel>
      </div>
    </PageShell>
  );
}

function AdminStatus({ label, value, icon: Icon }) {
  return (
    <div className="glass-row flex items-center justify-between rounded-lg p-3">
      <div className="flex items-center gap-3">
        <Icon className="size-4 text-zinc-500" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function LibraryView({ type }) {
  const data = libraryItems[type] || libraryItems.saved;
  const Icon = data.icon;

  return (
    <PageShell title={data.title} eyebrow="Workspace library">
      <div className="grid gap-3">
        {data.rows.map((row, index) => (
          <div
            key={row}
            className="glass-card flex items-center justify-between rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <Icon className="size-5 text-zinc-500" />
              <span className="font-medium">{row}</span>
            </div>
            <span className="text-sm text-zinc-500">#{index + 1}</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="glass-panel rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="size-5 text-zinc-500 dark:text-zinc-400" />
          <h2 className="font-semibold">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function InfoBlock({ title, icon: Icon, children }) {
  return (
    <div className="glass-row rounded-lg p-3">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-zinc-500" />
        {title}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="glass-row flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
    >
      <span
        className={`flex h-5 w-9 items-center rounded-full border p-0.5 transition ${
          checked
            ? "justify-end border-teal-800 bg-teal-800 dark:border-teal-100 dark:bg-teal-100"
            : "justify-start border-zinc-300 bg-white/45 dark:border-white/10 dark:bg-white/10"
        }`}
      >
        <span
          className={`size-3.5 rounded-full ${
            checked ? "bg-white dark:bg-teal-950" : "bg-zinc-500"
          }`}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

function IconAction({ icon: Icon, label }) {
  return (
    <Button variant="outline" size="icon-sm" title={label} aria-label={label}>
      <Icon />
    </Button>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="size-1.5 animate-pulse rounded-full bg-zinc-500"
          style={{ animationDelay: `${dot * 120}ms` }}
        />
      ))}
    </div>
  );
}
