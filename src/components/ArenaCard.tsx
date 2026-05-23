import { Link, useNavigate } from "@tanstack/react-router";
import { arenaAccent, type Arena, type Post } from "@/lib/orbit-store";
import { PlatformIcon } from "@/components/PlatformIcon";
import { Calendar, Network } from "lucide-react";



export function ArenaCard({ arena, posts }: { arena: Arena; posts: Post[] }) {
  const accent = arenaAccent[arena.color];
  const navigate = useNavigate();

  const scheduled = posts
    .filter((p) => p.arenaId === arena.id && p.status === "scheduled")
    .slice(0, 3);
  const next = scheduled[0];
  const uniquePlatforms = Array.from(new Set(arena.accounts.map((a) => a.platform)));

  return (
    <Link
      to="/arenas/$arenaId"
      params={{ arenaId: arena.id }}
      className="group relative rounded-xl border bg-card p-5 transition-all hover:border-transparent hover:bg-surface-2"
      style={{ boxShadow: `inset 0 0 0 1px ${accent.ring}` }}
    >
      <div className="absolute top-0 left-5 right-5 h-px" style={{ background: accent.hex }} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ background: accent.hex, boxShadow: `0 0 12px ${accent.hex}` }}
            />
            <h3 className="font-semibold tracking-tight">{arena.name}</h3>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {arena.accounts.length} accounts · {posts.filter((p) => p.arenaId === arena.id).length} posts
          </div>
        </div>
        <div className="flex gap-1.5">
          {uniquePlatforms.map((p) => (
            <div
              key={p}
              className="size-7 rounded-md grid place-items-center bg-background/60"
            >
              <PlatformIcon platform={p} size={13} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs">
        <Calendar size={12} className="text-muted-foreground" />
        <span className="text-muted-foreground">Next:</span>
        <span className="font-medium" style={{ color: accent.hex }}>
          {next?.scheduledAt ?? "Nothing scheduled"}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        {scheduled.length === 0 && (
          <div className="text-xs text-muted-foreground italic">Queue is empty</div>
        )}
        {scheduled.map((p) => (
          <div
            key={p.id}
            className="rounded-md bg-background/60 px-2.5 py-1.5 text-xs flex items-center gap-2"
          >
            <div className="flex gap-1">
              {p.platforms.slice(0, 3).map((pl) => (
                <PlatformIcon key={pl} platform={pl} size={11} />
              ))}
            </div>
            <span className="truncate text-muted-foreground flex-1">{p.caption}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between relative z-10">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Pipeline</span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate({ to: "/arenas/$arenaId/canvas", params: { arenaId: arena.id } });
          }}
          className="text-[11px] inline-flex items-center gap-1 hover:underline"
          style={{ color: accent.hex }}
        >
          <Network size={11} /> View Canvas
        </button>

      </div>
    </Link>
  );
}

