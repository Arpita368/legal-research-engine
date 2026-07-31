"use client";

import { useMemo, useState } from "react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { InputField } from "@/components/features/InputField";
import { Button } from "@/components/ui/button";

const defaultResults = [
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

const filters = [
  "Court",
  "Judge",
  "Year",
  "Citation",
  "Statute",
  "Article",
  "Case Type",
  "Keyword",
];

export function SearchWorkspace({ query, onQueryChange, onSearch }) {
  const [filterValues, setFilterValues] = useState({});
  const [semantic, setSemantic] = useState(true);
  const [infiniteScroll, setInfiniteScroll] = useState(false);
  const [sortBy, setSortBy] = useState("Most relevant");
  const [activeResults, setActiveResults] = useState(defaultResults);
  const [bookmarkedCitations, setBookmarkedCitations] = useState([]);
  const [selectedCitation, setSelectedCitation] = useState(
    defaultResults[0].citation,
  );
  const [statusMessage, setStatusMessage] = useState(
    "Ready to search the legal corpus.",
  );

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return activeResults.filter((item) => {
      const haystack = [
        item.title,
        item.court,
        item.citation,
        item.summary,
        item.sections,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
      const matchesFilters = Object.entries(filterValues).every(
        ([key, value]) => {
          if (!value) return true;
          return haystack.includes(value.toLowerCase());
        },
      );

      return matchesQuery && matchesFilters;
    });
  }, [activeResults, filterValues, query]);

  const handleFilterChange = (name, value) => {
    setFilterValues((current) => ({ ...current, [name]: value }));
  };

  const handleSearch = () => {
    const nextResults = defaultResults.filter((item) => {
      const haystack = [item.title, item.court, item.citation, item.summary]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });

    const resolvedResults =
      nextResults.length > 0 ? nextResults : defaultResults;
    setActiveResults(resolvedResults);
    setSelectedCitation(resolvedResults[0]?.citation || "");
    setStatusMessage(`Search completed for “${query.trim() || "all cases"}”.`);
  };

  const toggleBookmark = (citation) => {
    setBookmarkedCitations((current) =>
      current.includes(citation)
        ? current.filter((item) => item !== citation)
        : [...current, citation],
    );
    setStatusMessage(
      bookmarkedCitations.includes(citation)
        ? "Bookmark removed from the current result."
        : "Bookmark added to the current result.",
    );
  };

  const openResult = (citation) => {
    setSelectedCitation(citation);
    setStatusMessage("Result opened in the workspace view.");
  };

  const downloadResult = (title) => {
    setStatusMessage(`Download started for ${title}.`);
  };

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-lg p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="glass-input flex min-h-14 flex-1 items-center gap-3 rounded-lg px-4">
            <Search className="size-5 text-zinc-500" />
            <input
              aria-label="Search cases and statutes"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search cases, statutes, or issues"
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-zinc-500"
            />
          </label>
          <Button
            className="h-14 px-5"
            onClick={() => {
              handleSearch();
              onSearch?.();
            }}
          >
            <SlidersHorizontal />
            Run Hybrid Search
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filters.map((filter) => (
            <InputField
              key={filter}
              label={filter}
              placeholder={filter}
              value={filterValues[filter] ?? ""}
              onChange={(value) => handleFilterChange(filter, value)}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Toggle
            checked={semantic}
            onChange={setSemantic}
            label="Semantic Search Toggle"
          />
          <Toggle
            checked={infiniteScroll}
            onChange={setInfiniteScroll}
            label="Infinite Scroll"
          />
          <label className="ml-auto flex items-center gap-2 text-sm font-medium">
            <span>Sorting</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="glass-input h-9 rounded-lg px-3 text-sm outline-none"
            >
              <option>Most relevant</option>
              <option>Newest first</option>
              <option>Highest confidence</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-white/40 bg-white/50 p-3 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300">
        {statusMessage}
      </div>

      <div className="grid gap-4">
        {filteredResults.map((result) => (
          <CaseCard
            key={result.citation}
            result={result}
            bookmarked={bookmarkedCitations.includes(result.citation)}
            selected={selectedCitation === result.citation}
            onBookmark={() => toggleBookmark(result.citation)}
            onOpen={() => openResult(result.citation)}
            onDownload={() => downloadResult(result.title)}
          />
        ))}
      </div>

      <div className="glass-row flex flex-wrap items-center justify-between gap-3 rounded-lg p-3">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing {filteredResults.length} result
          {filteredResults.length === 1 ? "" : "s"} • Sorted by {sortBy}
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
    </div>
  );
}

function CaseCard({
  result,
  bookmarked,
  selected,
  onBookmark,
  onOpen,
  onDownload,
}) {
  return (
    <article
      className={`glass-card rounded-lg p-4 ${selected ? "ring-2 ring-teal-600/40" : ""}`}
    >
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
          <Button variant="outline" size="sm" onClick={onBookmark}>
            <Bookmark className={bookmarked ? "fill-current" : ""} />
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download />
            Download
          </Button>
          <Button size="sm" onClick={onOpen}>
            Open
          </Button>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {result.summary}
      </p>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <InfoBlock title="Key Holdings" icon={Bookmark}>
          <ul className="grid gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            {result.holdings.map((holding) => (
              <li key={holding} className="flex gap-2">
                <span className="mt-0.5 size-2 rounded-full bg-teal-600" />
                <span>{holding}</span>
              </li>
            ))}
          </ul>
        </InfoBlock>
        <InfoBlock title="Paragraphs" icon={Search}>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {result.paragraphs}
          </p>
        </InfoBlock>
        <InfoBlock title="Relevant Sections" icon={Filter}>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {result.sections}
          </p>
        </InfoBlock>
      </div>
    </article>
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
          className={`size-3.5 rounded-full ${checked ? "bg-white dark:bg-teal-950" : "bg-zinc-500"}`}
        />
      </span>
      <span>{label}</span>
    </button>
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
