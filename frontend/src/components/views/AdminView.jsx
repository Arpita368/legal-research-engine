"use client";

import { useState } from "react";
import {
  BarChart3,
  Database,
  FileClock,
  Gauge,
  Layers,
  LockKeyhole,
  RefreshCw,
  Server,
  Settings,
  Table,
  Upload,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/layout/PageShell";
import { adminTabs } from "@/components/data/legalData";

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

function SettingsRows({ rows }) {
  return (
    <div className="grid gap-2">
      {rows.map((row) => (
        <div
          key={row}
          className="glass-row flex items-center justify-between rounded-lg p-3 text-sm"
        >
          <span>{row}</span>
          <Database className="size-4" />
        </div>
      ))}
    </div>
  );
}

export function AdminView({ role, setRole }) {
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
            className={`h-10 rounded-md text-sm font-medium transition ${activeTab === tab ? "bg-teal-950 text-white dark:bg-teal-100 dark:text-teal-950" : "text-zinc-600 hover:bg-white/55 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"}`}
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
          <SettingsRows
            rows={[
              "Peak usage: 2 PM",
              "Top query: arbitration",
              "Memo exports: 42",
            ]}
          />
        </Panel>
        <Panel title="Settings" icon={Settings}>
          <SettingsRows
            rows={["Dataset lock on", "Audit log on", "Rebuild requires Admin"]}
          />
        </Panel>
      </div>
    </PageShell>
  );
}
