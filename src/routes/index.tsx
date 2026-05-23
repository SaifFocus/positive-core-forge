import { createFileRoute } from "@tanstack/react-router";
import { useOrbit, arenaAccent } from "@/lib/orbit-store";
import { ArenaCard } from "@/components/ArenaCard";
import { PlatformIcon } from "@/components/PlatformIcon";
import { CalendarClock, Send, Users, Orbit as OrbitIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Orbit" },
      { name: "description", content: "Cross-arena overview of scheduled content and brand pipelines." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { arenas, posts } = useOrbit();
  const scheduled = posts.filter((p) => p.status === "scheduled");
  const publishedThisWeek = posts.filter((p) => p.status === "published").length;
  const accountsCount = arenas.reduce((n, a) => n + a.accounts.length, 0);

  const stats = [
    { label: "Scheduled posts", value: scheduled.length, icon: CalendarClock, accent: "#FF6B6B" },
    { label: "Published this week", value: publishedThisWeek, icon: Send, accent: "#14B8A6" },
    { label: "Accounts connected", value: accountsCount, icon: Users, accent: "#3B82F6" },
    { label: "Arenas active", value: arenas.length, icon: OrbitIcon, accent: "#8B5CF6" },
  ];

  const days = ["Today", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Mission Control</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {scheduled.length} posts scheduled across {arenas.length} arenas.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon size={14} style={{ color: s.accent }} />
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</div>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Arenas
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {arenas.map((a) => (
            <ArenaCard key={a.id} arena={a} posts={posts} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Next 7 Days · Global Queue
        </h2>
        <div className="rounded-xl border bg-card p-4 overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[760px]">
            {days.map((day, i) => {
              const dayPosts = scheduled.slice(i, i + 2);
              return (
                <div key={day} className="space-y-2">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {day}
                  </div>
                  <div className="space-y-1.5 min-h-32">
                    {dayPosts.map((p) => {
                      const arena = arenas.find((a) => a.id === p.arenaId)!;
                      const accent = arenaAccent[arena.color];
                      return (
                        <div
                          key={p.id}
                          className="rounded-md p-2 text-[11px] bg-background/60"
                          style={{ borderLeft: `2px solid ${accent.hex}` }}
                        >
                          <div className="flex gap-1 mb-1">
                            {p.platforms.slice(0, 3).map((pl) => (
                              <PlatformIcon key={pl} platform={pl} size={10} />
                            ))}
                          </div>
                          <p className="line-clamp-2 text-muted-foreground leading-snug">
                            {p.caption}
                          </p>
                        </div>
                      );
                    })}
                    {dayPosts.length === 0 && (
                      <div className="text-[10px] text-muted-foreground/50 italic">—</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
