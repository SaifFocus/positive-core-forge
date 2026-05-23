import { createFileRoute } from "@tanstack/react-router";
import { useOrbit, arenaAccent } from "@/lib/orbit-store";
import { PlatformIcon } from "@/components/PlatformIcon";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar · Orbit" }] }),
  component: CalendarPage,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function CalendarPage() {
  const { posts, arenas } = useOrbit();
  const scheduled = posts.filter((p) => p.status === "scheduled");

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 space-y-6 max-w-7xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground mt-1 text-sm">All scheduled posts across every arena.</p>
      </header>

      <div className="rounded-xl border bg-card p-4 overflow-x-auto">
        <div className="grid grid-cols-7 gap-3 min-w-[900px]">
          {DAYS.map((day, i) => {
            const dayPosts = scheduled.slice(i * 1, i * 1 + 2);
            return (
              <div key={day} className="space-y-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{day}</div>
                <div className="min-h-64 space-y-2">
                  {dayPosts.map((p) => {
                    const arena = arenas.find((a) => a.id === p.arenaId)!;
                    const accent = arenaAccent[arena.color];
                    return (
                      <div
                        key={p.id}
                        className="rounded-md bg-background p-2.5"
                        style={{ borderLeft: `3px solid ${accent.hex}` }}
                      >
                        <div className="flex gap-1 mb-1.5">
                          {p.platforms.map((pl) => (
                            <PlatformIcon key={pl} platform={pl} size={11} />
                          ))}
                        </div>
                        <p className="text-[11px] line-clamp-3 text-muted-foreground leading-snug">{p.caption}</p>
                        <div className="text-[10px] mt-1.5" style={{ color: accent.hex }}>
                          {arena.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
