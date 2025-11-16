"use client";

import { AdvanceScriptTable } from "@/components/custom/AdvanceScriptTable";

export default function Home() {
  return (
    <main className="container mx-auto p-4 space-y-4">
      <p className="text-sm text-muted-foreground">
        Demo mode
      </p>
      <AdvanceScriptTable />
    </main>
  );
}
