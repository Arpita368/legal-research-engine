"use client";

// This view shows the main overview cards and recent activity for a signed-in user.
import {
  BookMarked,
  Check,
  ClipboardList,
  Download,
  FileText,
  Gavel,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/layout/PageShell";
import {
  dashboardStats,
  latestJudgments,
  recentMemos,
  recentSearches,
  taskHighlights,
  taskProgress,
} from "@/components/data/legalData";

function MetricCard({ stat }) {
  const Icon = { Check, Search, FileText, BookMarked }[stat.label] || Search;

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
      <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {stat.detail}
      </div>
    </div>
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

export function DashboardView({ userName = "Guest" }) {
  return (
    <PageShell
      title={`Task Dashboard`}
      eyebrow={`${userName}'s workspace overview`}
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
              <div key={memo.title} className="glass-row rounded-lg p-3">
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
              <div key={item.label} className="glass-row rounded-lg p-3">
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
                <div className="text-left text-sm font-medium md:text-right">
                  {judgment.date}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
