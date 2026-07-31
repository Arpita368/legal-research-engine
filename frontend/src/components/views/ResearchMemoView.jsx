"use client";

import { ChevronRight, Download, FileDown, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/layout/PageShell";
import { memoSections } from "@/components/data/legalData";

export function ResearchMemoView() {
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
            <section key={section.title} className="glass-card rounded-lg p-4">
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
            {[
              "Question",
              "Applicable Laws",
              "Relevant Cases",
              "Case Analysis",
            ].map((item) => (
              <button
                key={item}
                type="button"
                className="glass-row flex items-center justify-between rounded-lg p-3 text-sm font-medium hover:border-teal-600/45 dark:hover:border-teal-200/25"
              >
                {item}
                <ChevronRight className="size-4" />
              </button>
            ))}
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
