"use client";

import {
  CircleUserRound,
  Eye,
  KeyRound,
  LockKeyhole,
  Mic,
  ShieldCheck,
  User,
} from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { RoleSelect } from "@/components/layout/RoleSelect";

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

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-t border-white/45 pt-3 dark:border-white/10">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
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
          <User className="size-4" />
        </div>
      ))}
    </div>
  );
}

export function ProfileView({ role, setRole, userName, email = "" }) {
  return (
    <PageShell title="Profile" eyebrow="User Details">
      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Panel title="User Details" icon={CircleUserRound}>
          <div className="flex items-center gap-4">
            <div className="grid size-20 place-items-center rounded-lg bg-teal-950 text-white dark:bg-teal-100 dark:text-teal-950">
              <User className="size-9" />
            </div>
            <div>
              <div className="text-xl font-semibold">{userName}</div>
              <div className="mt-1 text-sm text-zinc-500">
                {email || `${role.toLowerCase()}@legalresearch.local`}
              </div>
              <div className="mt-3">
                <RoleSelect role={role} setRole={setRole} />
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <ProfileRow label="Role" value={role} />
            <ProfileRow
              label="Organization"
              value="Commercial Litigation Lab"
            />
            <ProfileRow label="Activity" value="184 searches this month" />
            <ProfileRow label="Usage" value="74 percent workspace quota" />
          </div>
        </Panel>

        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="API Keys" icon={KeyRound}>
            <SettingsRows
              rows={[
                "Production key active",
                "Test key restricted",
                "Last rotated Jul 29",
              ]}
            />
          </Panel>
          <Panel title="Sessions" icon={ShieldCheck}>
            <SettingsRows
              rows={[
                "Current device",
                "Chrome on Windows",
                "2 active sessions",
              ]}
            />
          </Panel>
          <Panel title="Security" icon={LockKeyhole}>
            <SettingsRows
              rows={["MFA ready", "Password updated", "Secure session active"]}
            />
          </Panel>
          <Panel title="Avatar" icon={User}>
            <SettingsRows
              rows={[
                "Black and white initials",
                "Organization badge",
                "Profile verified",
              ]}
            />
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
