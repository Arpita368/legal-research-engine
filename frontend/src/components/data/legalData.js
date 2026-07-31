export const roles = ["Admin", "Student"];

export const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: "Home" },
  { id: "chat", label: "Legal Assistant", icon: "Bot" },
  { id: "search", label: "Legal Search", icon: "Search" },
  { id: "memo", label: "Research Memo", icon: "FileText" },
  { id: "saved", label: "Saved Searches", icon: "Archive" },
  { id: "bookmarks", label: "Bookmarks", icon: "Bookmark" },
  { id: "history", label: "History", icon: "History" },
  { id: "notifications", label: "Notifications", icon: "Bell" },
  { id: "profile", label: "Profile", icon: "User" },
  { id: "settings", label: "Settings", icon: "Settings" },
  { id: "admin", label: "Admin", icon: "ShieldCheck" },
];

export const dashboardStats = [
  { label: "Tasks Completed", value: "184", detail: "searches, memos and exports", icon: "Check" },
  { label: "Research Searches", value: "126", detail: "38 saved for follow-up", icon: "Search" },
  { label: "Memos Drafted", value: "42", detail: "18 reviewed this month", icon: "FileText" },
  { label: "Sources Reviewed", value: "316", detail: "citation records opened", icon: "BookMarked" },
];

export const recentSearches = [
  "Execution of foreign commercial decrees in India",
  "Section 34 waiver after partial award payment",
  "Specific performance in infrastructure contracts",
  "Commercial Courts Act urgent interim relief",
];

export const recentMemos = [
  { title: "Arbitration award challenge after settlement", date: "Jul 30, 2026", status: "Draft" },
  { title: "Maintainability under Article 226 in contract disputes", date: "Jul 29, 2026", status: "Reviewed" },
  { title: "Limitation for execution of foreign judgment", date: "Jul 28, 2026", status: "Exported" },
];

export const latestJudgments = [
  { title: "M/s. Precision Infrastructure v. State Trading Corp.", court: "Supreme Court of India", date: "2026-07-18", citation: "2026 INSC 184" },
  { title: "Eastern Logistics Ltd. v. Union of India", court: "Supreme Court of India", date: "2026-07-11", citation: "2026 INSC 177" },
  { title: "Apex Steel Works v. Nova Finance", court: "Supreme Court of India", date: "2026-07-04", citation: "2026 INSC 169" },
];

export const taskProgress = [
  { label: "Research queue", value: 76, detail: "19 of 25 active tasks completed" },
  { label: "Memo workflow", value: 68, detail: "17 drafts moved to review" },
  { label: "Source validation", value: 84, detail: "63 cited sources checked" },
];

export const taskHighlights = [
  "9 searches completed today",
  "4 memos updated this week",
  "12 bookmarks added",
  "7 exports generated",
];

export const searchResults = [
  {
    title: "Renusagar Power Co. Ltd. v. General Electric Co.",
    court: "Supreme Court of India",
    citation: "1994 Supp (1) SCC 644",
    summary: "Public policy objections to enforcement are construed narrowly in foreign award enforcement, with emphasis on finality and commercial certainty.",
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
    summary: "Clarifies post-2015 public policy review and separates jurisdictional defects from merits reappreciation in arbitral award challenges.",
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
    summary: "Draws the boundary between arbitrable rights in personam and non-arbitrable rights in rem for civil and commercial disputes.",
    holdings: [
      "Commercial contractual disputes are generally arbitrable.",
      "Actions involving public status or rights in rem are excluded.",
    ],
    paragraphs: "Paras 22, 36, 38",
    sections: "Arbitration and Conciliation Act, 1996, Sections 8 and 11",
  },
];

export const chatSources = [
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

export const memoSections = [
  { title: "Question", content: "Whether a party that accepts partial payment under an arbitral award can still challenge the remaining award under Section 34." },
  { title: "Applicable Laws", content: "Arbitration and Conciliation Act, 1996, Sections 34, 35 and 36; Indian Contract Act, 1872, Sections 63 and 65." },
  { title: "Relevant Cases", content: "Ssangyong Engineering v. NHAI; Associate Builders v. DDA; National Highways Authority of India v. M. Hakeem." },
  { title: "Case Analysis", content: "Acceptance of a severable, undisputed amount is not by itself a waiver unless the conduct shows full satisfaction or an election inconsistent with challenge." },
  { title: "Court Reasoning", content: "Courts separate finality of awards from limited statutory review, and examine whether the challenge attacks jurisdiction, natural justice or patent illegality." },
  { title: "Arguments", content: "The challenger can argue severability, absence of accord and satisfaction, and preservation of rights before accepting payment." },
  { title: "Counter Arguments", content: "The respondent can argue approbate and reprobate, waiver, estoppel and commercial finality where acceptance was unconditional." },
  { title: "Conclusion", content: "A challenge can remain maintainable if acceptance was qualified, partial and not inconsistent with the relief sought under Section 34." },
  { title: "References", content: "Paragraph-level sources should be attached to each proposition before export." },
];

export const adminTabs = ["Datasets", "Users", "Search Logs", "Analytics", "Monitoring", "Settings"];

export const libraryItems = {
  saved: {
    title: "Saved Searches",
    icon: "Archive",
    rows: [
      "Foreign judgment execution and limitation",
      "Commercial Courts Act jurisdiction threshold",
      "Arbitrability of fraud in commercial contracts",
      "Constitutional writs in tender disputes",
    ],
  },
  bookmarks: {
    title: "Bookmarks",
    icon: "Bookmark",
    rows: [
      "Booz Allen & Hamilton Inc. v. SBI Home Finance Ltd.",
      "Ssangyong Engineering v. NHAI",
      "Renusagar Power Co. Ltd. v. General Electric Co.",
      "Associate Builders v. DDA",
    ],
  },
  history: {
    title: "History",
    icon: "History",
    rows: [
      "Opened source viewer for Section 34 cases",
      "Downloaded memo draft",
      "Rebuilt semantic search filters",
      "Viewed dataset status",
    ],
  },
  notifications: {
    title: "Notifications",
    icon: "Bell",
    rows: [
      "Volume 7 Part 1 indexing completed",
      "Two memos are waiting for source validation",
      "BM25 rebuild scheduled",
      "New admin upload requires review",
    ],
  },
};
