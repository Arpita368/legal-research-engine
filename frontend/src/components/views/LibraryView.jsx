"use client";

import { Archive, Bell, Bookmark, History } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { libraryItems } from "@/components/data/legalData";

const iconMap = { Archive, Bookmark, History, Bell };

export function LibraryView({ type }) {
  const data = libraryItems[type] || libraryItems.saved;
  const Icon = iconMap[data.icon] || Archive;

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
