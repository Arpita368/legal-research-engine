"use client";

import { Search } from "lucide-react";

export function SearchBar({ value, onChange, placeholder = "Search" }) {
  return (
    <label className="glass-input flex min-h-10 items-center gap-2 rounded-lg px-3">
      <Search className="size-4 text-zinc-500" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
      />
    </label>
  );
}
