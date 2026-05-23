import { createFileRoute, Link } from "@tanstack/react-router";
import { useOrbit } from "@/lib/orbit-store";
import { ArenaCard } from "@/components/ArenaCard";

export const Route = createFileRoute("/arenas/")({
  head: () => ({ meta: [{ title: "Arenas · Orbit" }] }),
  component: ArenasIndex,
});

function ArenasIndex() {
  const { arenas, posts } = useOrbit();
  return (
    <div className="px-4 md:px-8 py-6 md:py-8 space-y-6 max-w-7xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Arenas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Pick a brand identity to manage its accounts, pipeline, and DNA.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {arenas.map((a) => (
          <ArenaCard key={a.id} arena={a} posts={posts} />
        ))}
      </div>
      <div className="text-xs text-muted-foreground">
        Tip: open any arena to access the pipeline kanban and Brand DNA.
        Back to <Link to="/" className="underline">Dashboard</Link>.
      </div>
    </div>
  );
}
