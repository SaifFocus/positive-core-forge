import { Handle, Position, type NodeProps } from "reactflow";
import { PlatformIcon } from "@/components/PlatformIcon";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Link2 } from "lucide-react";
import type { Platform, PostStatus } from "@/lib/orbit-store";
import { platformMeta } from "@/lib/orbit-store";

const statusColor: Record<PostStatus, string> = {
  ideas: "#6b7280",
  drafts: "#9ca3af",
  scheduled: "#3b82f6",
  published: "#10b981",
};

export function ArenaNode({ data }: NodeProps<{ name: string; accent: string }>) {
  return (
    <div
      className="rounded-xl px-5 py-4 min-w-[200px] bg-card"
      style={{ border: `2px solid ${data.accent}`, boxShadow: `0 0 32px ${data.accent}40` }}
    >
      <div className="flex items-center gap-2">
        <span
          className="size-3 rounded-full"
          style={{ background: data.accent, boxShadow: `0 0 12px ${data.accent}` }}
        />
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Arena</div>
      </div>
      <div className="font-semibold text-base mt-1">{data.name}</div>
      <Handle type="source" position={Position.Right} style={{ background: data.accent }} />
    </div>
  );
}

export function BrandDnaNode({ data }: NodeProps<{ tone: string; pillars: string[] }>) {
  return (
    <div
      className="rounded-xl px-4 py-3 max-w-[260px] bg-card cursor-pointer hover:bg-surface-2 transition"
      style={{ border: "1.5px solid #F59E0B", boxShadow: "0 0 24px rgba(245,158,11,0.2)" }}
    >
      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium">
        <Sparkles size={12} /> Brand DNA
      </div>
      <p className="text-[11px] text-foreground/80 mt-1.5 line-clamp-2">{data.tone}</p>
      <div className="flex gap-1 flex-wrap mt-2">
        {data.pillars.slice(0, 3).map((p) => (
          <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">
            {p}
          </span>
        ))}
      </div>
      <Handle type="target" position={Position.Left} style={{ background: "#F59E0B" }} />
    </div>
  );
}

export function AccountNode({
  data,
}: NodeProps<{ platform: Platform; handle: string; type: "primary" | "burner"; active: boolean; followers: string }>) {
  const color = platformMeta[data.platform].color;
  return (
    <div
      className="rounded-lg px-3 py-2.5 min-w-[200px] bg-card cursor-pointer hover:bg-surface-2 transition"
      style={{ borderLeft: `3px solid ${color}`, border: "1px solid hsl(var(--border))", borderLeftWidth: 3, borderLeftColor: color }}
    >
      <div className="flex items-center gap-2">
        <PlatformIcon platform={data.platform} size={14} />
        <span className="text-sm font-medium flex-1 truncate">{data.handle}</span>
        <span
          className="size-1.5 rounded-full"
          style={{ background: data.active ? "#10b981" : "#4b5563" }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <Badge variant={data.type === "primary" ? "default" : "outline"} className="text-[9px] h-4 px-1.5 capitalize">
          {data.type}
        </Badge>
        <span className="text-[10px] text-muted-foreground">{data.followers}</span>
      </div>
      <Handle type="target" position={Position.Left} style={{ background: color }} />
      <Handle type="source" position={Position.Right} style={{ background: color }} />
    </div>
  );
}

export function PostNode({
  data,
}: NodeProps<{ caption: string; platforms: Platform[]; status: PostStatus; linked?: boolean }>) {
  const color = statusColor[data.status];
  return (
    <div
      className="rounded-md px-2.5 py-2 w-[200px] bg-card cursor-pointer hover:bg-surface-2 transition text-left"
      style={{ borderLeft: `3px solid ${color}`, border: "1px solid hsl(var(--border))", borderLeftWidth: 3, borderLeftColor: color }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex gap-1">
          {data.platforms.map((p) => (
            <PlatformIcon key={p} platform={p} size={10} />
          ))}
        </div>
        <div className="flex items-center gap-1">
          {data.linked && <Link2 size={9} className="text-purple-400" />}
          <span className="text-[9px] uppercase tracking-wide" style={{ color }}>
            {data.status}
          </span>
        </div>
      </div>
      <p className="text-[10px] leading-snug line-clamp-2 text-foreground/85">{data.caption}</p>
      <Handle type="target" position={Position.Left} style={{ background: color, opacity: 0.5 }} />
      <Handle type="source" position={Position.Right} style={{ background: color, opacity: 0.5 }} />
    </div>
  );
}

export function CampaignNode({ data }: NodeProps<{ name: string }>) {
  return (
    <div
      className="rounded-md px-3 py-2 bg-card"
      style={{ border: "1.5px dashed #8B5CF6", boxShadow: "0 0 16px rgba(139,92,246,0.2)" }}
    >
      <div className="flex items-center gap-1.5 text-purple-400 text-[10px] uppercase tracking-wider font-medium">
        <Link2 size={10} /> Campaign
      </div>
      <div className="text-xs font-medium text-foreground mt-0.5">{data.name}</div>
      <Handle type="source" position={Position.Bottom} style={{ background: "#8B5CF6" }} />
    </div>
  );
}

export function AddAccountNode({ data }: NodeProps<{ onClick: () => void }>) {
  return (
    <button
      onClick={data.onClick}
      className="rounded-lg px-3 py-3 min-w-[200px] bg-transparent text-muted-foreground hover:text-foreground hover:border-foreground/40 transition flex items-center justify-center gap-2 text-sm"
      style={{ border: "1.5px dashed hsl(var(--border))" }}
    >
      <Plus size={14} /> Add account
      <Handle type="target" position={Position.Left} style={{ background: "transparent", border: "none" }} />
    </button>
  );
}

export const nodeTypes = {
  arena: ArenaNode,
  brandDna: BrandDnaNode,
  account: AccountNode,
  post: PostNode,
  campaign: CampaignNode,
  addAccount: AddAccountNode,
};
