"use client";

import {
  Bell,
  BookOpen,
  Check,
  Eye,
  KeyRound,
  Mic,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="glass-panel rounded-lg p-4">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-5 text-zinc-500 dark:text-zinc-400" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
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
        className={`flex h-5 w-9 items-center rounded-full border p-0.5 transition ${checked ? "justify-end border-teal-800 bg-teal-800 dark:border-teal-100 dark:bg-teal-100" : "justify-start border-zinc-300 bg-white/45 dark:border-white/10 dark:bg-white/10"}`}
      >
        <span
          className={`size-3.5 rounded-full ${checked ? "bg-white dark:bg-teal-950" : "bg-zinc-500"}`}
        />
      </span>
      <span>{label}</span>
    </button>
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

export function SettingsView({ theme, setTheme, role }) {
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
          <SettingsRows
            rows={["English", "Indian legal corpus", "Neutral date format"]}
          />
        </Panel>
        <Panel title="Notifications" icon={Bell}>
          <SettingsRows
            rows={["Judgment uploads", "Memo exports", "Index health"]}
          />
        </Panel>
        <Panel title="Voice" icon={Mic}>
          <SettingsRows
            rows={[
              "Voice input ready",
              "Voice output ready",
              "Transcript retention off",
            ]}
          />
        </Panel>
        <Panel title="Accessibility" icon={Eye}>
          <SettingsRows
            rows={[
              "High contrast",
              "Large hit targets",
              "Reduced motion ready",
            ]}
          />
        </Panel>
        <Panel title="Privacy" icon={ShieldCheck}>
          <SettingsRows
            rows={[
              "Private workspace",
              "Source logs retained",
              `Current role: ${role}`,
            ]}
          />
        </Panel>
        <Panel title="API Keys" icon={KeyRound}>
          <SettingsRows
            rows={[
              "Masked by default",
              "Scoped permissions",
              "Revocation ready",
            ]}
          />
        </Panel>
      </div>
    </PageShell>
  );
}
