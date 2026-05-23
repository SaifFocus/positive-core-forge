import { createFileRoute } from "@tanstack/react-router";
import { useOrbit, arenaAccent } from "@/lib/orbit-store";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · Orbit" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { arenas, posts } = useOrbit();

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 space-y-6 max-w-7xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">Per-arena performance snapshot.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {arenas.map((arena) => {
          const accent = arenaAccent[arena.color];
          const arenaPosts = posts.filter((p) => p.arenaId === arena.id);
          const published = arenaPosts.filter((p) => p.status === "published").length;
          const scheduled = arenaPosts.filter((p) => p.status === "scheduled").length;
          const drafts = arenaPosts.filter((p) => p.status === "drafts").length;
          return (
            <div key={arena.id} className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="size-2.5 rounded-full" style={{ background: accent.hex }} />
                <h3 className="font-medium">{arena.name}</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Stat label="Drafts" value={drafts} />
                <Stat label="Scheduled" value={scheduled} accent={accent.hex} />
                <Stat label="Published" value={published} />
              </div>
              <div className="mt-4 h-2 rounded-full bg-background overflow-hidden flex">
                {[drafts, scheduled, published].map((v, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${(v / Math.max(1, drafts + scheduled + published)) * 100}%`,
                      background: [accent.ring, accent.hex, "white"][i],
                      opacity: i === 2 ? 0.4 : 1,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div>
      <div className="text-xl font-semibold" style={accent ? { color: accent } : undefined}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
