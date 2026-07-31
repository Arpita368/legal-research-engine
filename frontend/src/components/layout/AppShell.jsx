"use client";

// This is the main application shell. It controls whether the user is authenticated,
// which view is active, and the shared app-wide state for the dashboard experience.
import { useEffect, useState } from "react";
import {
  Archive,
  Bell,
  Bookmark,
  Bot,
  CircleUserRound,
  FileText,
  History,
  Home,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/features/SearchBar";
import { DashboardView } from "@/components/views/DashboardView";
import { LegalSearchView } from "@/components/views/LegalSearchView";
import { AIChatView } from "@/components/views/AIChatView";
import { ResearchMemoView } from "@/components/views/ResearchMemoView";
import { ProfileView } from "@/components/views/ProfileView";
import { SettingsView } from "@/components/views/SettingsView";
import { AdminView } from "@/components/views/AdminView";
import { LibraryView } from "@/components/views/LibraryView";
import { AuthExperience } from "@/components/views/AuthExperience";
import { roles, sidebarItems } from "@/components/data/legalData";
import { getStoredSession, logoutUser } from "@/components/auth/authStore";

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
        <Search className="size-5" />
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

function Sidebar({ activeView, onOpenView, role, userName, onLogout }) {
  return (
    <aside className="glass-sidebar hidden w-72 shrink-0 border-r border-white/50 p-3 dark:border-white/10 lg:flex lg:flex-col">
      <div className="p-2">
        <BrandMark />
      </div>
      <div className="mt-5 flex-1 overflow-y-auto pr-1">
        <NavList
          items={sidebarItems}
          activeView={activeView}
          onOpenView={onOpenView}
        />
      </div>
      <div className="glass-card mt-5 rounded-lg p-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-teal-950 text-white dark:bg-teal-100 dark:text-teal-950">
            <CircleUserRound className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{userName}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {role}
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="mt-2 text-left text-xs font-medium text-teal-700 hover:underline dark:text-teal-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavList({ items, activeView, onOpenView }) {
  const iconMap = {
    Home,
    Bot,
    Search,
    FileText,
    Archive,
    Bookmark,
    History,
    Bell,
    User,
    Settings,
    ShieldCheck,
  };

  return (
    <nav className="grid gap-1">
      {items.map((item) => {
        const Icon = iconMap[item.icon] || Search;
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

function TopNav({
  role,
  setRole,
  theme,
  setTheme,
  onMenu,
  searchValue,
  onSearchChange,
}) {
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

        <div className="hidden min-w-0 flex-1 sm:flex">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search cases, statutes, memos"
          />
        </div>

        <Button
          aria-label="Notifications"
          title="Notifications"
          variant="outline"
          size="icon"
        >
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

function PageShell({ title, eyebrow, actions, children }) {
  return (
    <section className="h-full overflow-y-auto">
      <div className="mx-auto grid max-w-7xl gap-5 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {eyebrow}
            </p>
            <h1 className="mt-1 text-3xl font-semibold">{title}</h1>
          </div>
          {actions ? (
            <div className="flex flex-wrap gap-2">{actions}</div>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function AppShell() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [theme, setTheme] = useState("dark");
  const [role, setRole] = useState("Admin");
  const [userName, setUserName] = useState("Guest");
  const [userEmail, setUserEmail] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSource, setActiveSource] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [globalSearchQuery, setGlobalSearchQuery] = useState(
    "Can an arbitral award be challenged after accepting partial payment?",
  );

  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      setUserName(session.name || "Guest");
      setUserEmail(session.email || "");
      setRole(session.role || "Admin");
      setIsAuthenticated(true);
    }
  }, []);

  const openView = (view) => {
    setActiveView(view);
    setMobileNavOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setUserName("Guest");
    setUserEmail("");
    setRole("Admin");
    setActiveView("dashboard");
    setAuthMode("login");
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView userName={userName} />;
      case "chat":
        return (
          <AIChatView
            activeSource={activeSource}
            setActiveSource={setActiveSource}
          />
        );
      case "search":
        return (
          <LegalSearchView
            globalSearchQuery={globalSearchQuery}
            setGlobalSearchQuery={setGlobalSearchQuery}
          />
        );
      case "memo":
        return <ResearchMemoView />;
      case "profile":
        return (
          <ProfileView
            role={role}
            setRole={setRole}
            userName={userName}
            email={userEmail}
          />
        );
      case "settings":
        return <SettingsView theme={theme} setTheme={setTheme} role={role} />;
      case "admin":
        return <AdminView role={role} setRole={setRole} />;
      default:
        return <LibraryView type={activeView} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthExperience
        authMode={authMode}
        onAuthModeChange={setAuthMode}
        onAuthenticated={(nextUser) => {
          setUserName(nextUser.name || "Guest");
          setUserEmail(nextUser.email || "");
          setRole(nextUser.role || "Admin");
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
      className={`${theme === "dark" ? "dark" : ""} min-h-screen glass-app text-zinc-950 dark:text-white`}
    >
      <div className="flex min-h-screen">
        <Sidebar
          activeView={activeView}
          onOpenView={openView}
          role={role}
          userName={userName}
          onLogout={handleLogout}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav
            role={role}
            setRole={setRole}
            theme={theme}
            setTheme={setTheme}
            onMenu={() => setMobileNavOpen(true)}
            searchValue={globalSearchQuery}
            onSearchChange={setGlobalSearchQuery}
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

          <main className="min-w-0 flex-1 overflow-hidden">{renderView()}</main>
        </div>
      </div>
    </div>
  );
}

export { BrandMark, PageShell };
