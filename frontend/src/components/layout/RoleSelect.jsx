"use client";

import { roles } from "@/components/data/legalData";

export function RoleSelect({ role, setRole, compact = false }) {
  return (
    <label className="relative">
      <span className="sr-only">Role</span>
      <select
        value={role}
        onChange={(event) => setRole(event.target.value)}
        className={`glass-input appearance-none rounded-lg text-sm font-medium outline-none ${compact ? "h-9 px-3 pr-8" : "h-10 px-3 pr-8"}`}
      >
        {roles.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-zinc-500">
        ⌄
      </span>
    </label>
  );
}
