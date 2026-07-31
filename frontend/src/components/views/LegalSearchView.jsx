"use client";

import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/layout/PageShell";
import { SearchWorkspace } from "@/components/features/SearchWorkspace";

export function LegalSearchView({ globalSearchQuery, setGlobalSearchQuery }) {
  return (
    <PageShell
      title="Legal Search"
      eyebrow="Dedicated legal database search"
      actions={
        <>
          <Button variant="outline">
            <Filter />
            Advanced Filters
          </Button>
          <Button>
            <Search />
            Search
          </Button>
        </>
      }
    >
      <SearchWorkspace
        query={globalSearchQuery}
        onQueryChange={setGlobalSearchQuery}
      />
    </PageShell>
  );
}
