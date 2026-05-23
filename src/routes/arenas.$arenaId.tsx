import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useOrbit, arenaAccent, type PostStatus } from "@/lib/orbit-store";
import { PlatformIcon } from "@/components/PlatformIcon";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/arenas/$arenaId")({
  head: ({ params }) => ({
    meta: [{ title: `Arena · ${params.arenaId} · Orbit` }],
  }),
  component: ArenaView,
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <p>Arena not found.</p>
      <Link to="/" className="underline text-sm">Back to dashboard</Link>
    </div>
  ),
});

const COLUMNS: { key: PostStatus; label: string }[] = [
  { key: "ideas", label: "Ideas" },
  { key: "drafts", label: "Drafts" },
  { key: "scheduled", label: "Scheduled" },
  { key: "published", label: "Published" },
];

function ArenaView() {
  const { arenaId } = Route.useParams();
  const { arenas, posts, openComposer, openBrandDna } = useOrbit();
  const arena = arenas.find((a) => a.id === arenaId);
  if (!arena) throw notFound();
  const accent = arenaAccent[arena.color];
  const arenaPosts = posts.filter((p) => p.arenaId === arena.id);

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 space-y-6 max-w-[1500px] mx-auto">
      <div>
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ChevronLeft size={12} /> Dashboard
        </Link>
      </div>

      <header
        className="rounded-xl border bg-card p-5 md:p-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent.bg}, transparent 60%)`, borderColor: accent.ring }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="size-3 rounded-full" style={{ background: accent.hex, boxShadow: `0 0 16px ${accent.hex}` }} />
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{arena.name}</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {arena.accounts.length} accounts · {arenaPosts.length} posts in pipeline
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => openBrandDna(arena.id)}>
              <Sparkles size={14} /> Brand DNA
            </Button>
            <Button onClick={() => openComposer(arena.id)} style={{ background: accent.hex, color: "white" }}>
              <Plus size={14} /> New Post
            </Button>
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Accounts</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {arena.accounts.map((acc) => (
            <div
              key={acc.id}
              className="min-w-[200px] rounded-lg border bg-card p-3 flex items-center gap-3"
            >
              <div className="size-9 rounded-md bg-background grid place-items-center">
                <PlatformIcon platform={acc.platform} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{acc.handle}</div>
                <div className="text-[10px] text-muted-foreground">Last post · {acc.lastPostAt ?? "—"}</div>
              </div>
              <Badge
                variant={acc.type === "primary" ? "default" : "outline"}
                className="text-[10px] capitalize"
              >
                {acc.type}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const colPosts = arenaPosts.filter((p) => p.status === col.key);
            return (
              <div key={col.key} className="rounded-xl border bg-surface/60 flex flex-col max-h-[70vh]">
                <div className="flex items-center justify-between px-3 py-2.5 border-b">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{col.label}</span>
                    <Badge variant="secondary" className="text-[10px] h-5">{colPosts.length}</Badge>
                  </div>
                </div>
                <div className="p-2 space-y-2 overflow-y-auto flex-1">
                  {colPosts.map((p) => (
                    <PostCard key={p.id} post={p} arena={arena} />
                  ))}
                  {colPosts.length === 0 && (
                    <div className="text-xs text-muted-foreground/60 italic px-2 py-6 text-center">
                      Nothing here yet
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <button
        onClick={() => openComposer(arena.id)}
        className="fixed bottom-20 md:bottom-8 right-6 z-30 rounded-full shadow-lg size-14 grid place-items-center transition-transform hover:scale-105"
        style={{ background: accent.hex, color: "white", boxShadow: `0 8px 32px ${accent.hex}66` }}
        aria-label="New post"
      >
        <Plus size={22} />
      </button>
    </div>
  );
}
