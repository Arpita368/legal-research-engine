"use client";

import { useState } from "react";
import {
  BookOpen,
  Copy,
  FileDown,
  Mic,
  MoreHorizontal,
  PanelRightOpen,
  Plus,
  RefreshCw,
  Send,
  Square,
  ThumbsDown,
  ThumbsUp,
  Upload,
  Volume2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { chatSources } from "@/components/data/legalData";

function ChatBubble({ speaker, variant = "question", children }) {
  const isAnswer = variant === "answer";

  return (
    <div className={`flex gap-3 ${isAnswer ? "" : "justify-end"}`}>
      {isAnswer ? (
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-teal-950 text-white dark:bg-teal-100 dark:text-teal-950">
          <BookOpen className="size-5" />
        </div>
      ) : null}
      <div
        className={`max-w-[88%] rounded-lg border p-4 text-sm leading-6 ${isAnswer ? "glass-card" : "border-teal-950 bg-teal-950 text-white shadow-lg shadow-teal-950/10 dark:border-teal-100 dark:bg-teal-100 dark:text-teal-950"}`}
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
              {source.citation} | {source.paragraph} | Confidence{" "}
              {source.confidence}
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
            className={`rounded-lg border p-3 text-left text-sm transition ${activeSource?.caseName === source.caseName ? "border-teal-700/50 bg-white/70 dark:border-teal-200/30 dark:bg-white/10" : "border-white/50 bg-white/35 hover:border-teal-600/45 dark:border-white/10 dark:bg-white/5 dark:hover:border-teal-200/25"}`}
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
          <SourceDetail
            label="Paragraph Number"
            value={activeSource.paragraph}
          />
          <SourceDetail
            label="Applicable Statute"
            value={activeSource.statute}
          />
          <SourceDetail
            label="Constitution Article"
            value={activeSource.article}
          />
          <SourceDetail label="Judgment Date" value={activeSource.date} />
          <SourceDetail
            label="Confidence Score"
            value={activeSource.confidence}
          />
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

function IconAction({ icon: Icon, label }) {
  return (
    <Button variant="outline" size="icon-sm" title={label} aria-label={label}>
      <Icon />
    </Button>
  );
}

export function AIChatView({ activeSource, setActiveSource }) {
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
              className={`rounded-lg border p-3 text-left text-sm ${index === 0 ? "border-teal-700/50 bg-white/70 dark:border-teal-200/30 dark:bg-white/10" : "border-white/50 bg-white/35 hover:border-teal-600/45 dark:border-white/10 dark:bg-white/5 dark:hover:border-teal-200/25"}`}
            >
              <div className="font-medium">{conversation}</div>
              <div className="mt-1 text-xs text-zinc-500">
                Conversation List
              </div>
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
              Can an arbitral award be challenged after accepting partial
              payment?
            </ChatBubble>
            <ChatBubble speaker="Assistant" variant="answer">
              <div className="grid gap-4">
                <p>
                  Yes, a Section 34 challenge may remain maintainable where the
                  accepted payment is severable, qualified and not treated as
                  full satisfaction of the award.
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
                        <td className="p-3">
                          Severability and reservation of rights
                        </td>
                      </tr>
                      <tr className="border-t border-white/45 dark:border-white/10">
                        <td className="p-3">Waiver</td>
                        <td className="p-3">
                          Clear election or accord and satisfaction
                        </td>
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
              <span className="px-2 text-sm text-zinc-500">
                Streaming Responses
              </span>
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

      <SourcePanel
        activeSource={activeSource}
        setActiveSource={setActiveSource}
      />
    </section>
  );
}
