import { PlatformIcon } from "@/components/PlatformIcon";
import { arenaAccent, type Post, type Arena } from "@/lib/orbit-store";
import { Badge } from "@/components/ui/badge";
import { Link2, Clock, Layers } from "lucide-react";

export function PostCard({ post, arena }: { post: Post; arena: Arena }) {
  const accent = arenaAccent[arena.color];
  return (
    <div
      className="group rounded-lg border bg-card p-3 cursor-pointer transition-all hover:bg-surface-2 hover:border-transparent"
      style={{ borderLeft: `3px solid ${accent.hex}` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1.5">
          {post.platforms.map((p) => (
            <PlatformIcon key={p} platform={p} size={12} />
          ))}
        </div>
        <div className="flex items-center gap-1">
          {post.linked && (
            <Link2 size={11} className="text-muted-foreground" />
          )}
        </div>
      </div>
      <p className="text-xs leading-relaxed line-clamp-2 text-foreground/90">{post.caption}</p>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {post.scheduledAt && (
            <Badge variant="secondary" className="text-[10px] font-normal gap-1 px-1.5 py-0">
              <Clock size={9} />
              {post.scheduledAt}
            </Badge>
          )}
          {post.publishedAt && (
            <span className="text-[10px] text-muted-foreground">{post.publishedAt}</span>
          )}
          {post.campaign && (
            <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0">
              {post.campaign} · #{post.seriesPosition}
            </Badge>
          )}
        </div>
        {post.variants ? (
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
            <Layers size={9} /> {post.variants} variants
          </span>
        ) : null}
      </div>
    </div>
  );
}
