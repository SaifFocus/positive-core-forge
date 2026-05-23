import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useCallback } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { useOrbit, arenaAccent, type PostStatus } from "@/lib/orbit-store";
import { nodeTypes } from "@/components/canvas/nodes";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/arenas/$arenaId/canvas")({
  head: ({ params }) => ({
    meta: [{ title: `Canvas · ${params.arenaId} · Orbit` }],
  }),
  component: ArenaCanvas,
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <p>Arena not found.</p>
      <Link to="/" className="underline text-sm">Back</Link>
    </div>
  ),
});

const statusColor: Record<PostStatus, string> = {
  ideas: "#6b7280",
  drafts: "#9ca3af",
  scheduled: "#3b82f6",
  published: "#10b981",
};

const fakeFollowers = ["12.4k", "3.1k", "847", "28.9k", "5.2k", "1.8k", "94"];

function ArenaCanvas() {
  const { arenaId } = Route.useParams();
  const navigate = useNavigate();
  const { arenas, posts, openComposer, openBrandDna, updatePost } = useOrbit();
  const arena = arenas.find((a) => a.id === arenaId);
  if (!arena) throw notFound();
  const accent = arenaAccent[arena.color];
  const arenaPosts = posts.filter((p) => p.arenaId === arena.id);

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Arena root
    nodes.push({
      id: "arena",
      type: "arena",
      position: { x: 60, y: 320 },
      data: { name: arena.name, accent: accent.hex },
    });

    // Brand DNA
    nodes.push({
      id: "brand-dna",
      type: "brandDna",
      position: { x: 360, y: 60 },
      data: { tone: arena.brandDna.tone, pillars: arena.brandDna.pillars },
    });
    edges.push({
      id: "e-arena-dna",
      source: "arena",
      target: "brand-dna",
      animated: true,
      style: { stroke: "#F59E0B", strokeWidth: 1.5 },
    });

    // Accounts
    const accountBaseY = 220;
    const accountGap = 130;
    arena.accounts.forEach((acc, i) => {
      const id = `acc-${acc.id}`;
      nodes.push({
        id,
        type: "account",
        position: { x: 360, y: accountBaseY + i * accountGap },
        data: {
          platform: acc.platform,
          handle: acc.handle,
          type: acc.type,
          active: i % 3 !== 2,
          followers: fakeFollowers[i % fakeFollowers.length],
        },
      });
      edges.push({
        id: `e-arena-${id}`,
        source: "arena",
        target: id,
        style: { stroke: accent.hex, strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: accent.hex },
      });
    });

    // Add account node
    nodes.push({
      id: "add-account",
      type: "addAccount",
      position: { x: 360, y: accountBaseY + arena.accounts.length * accountGap },
      data: { onClick: () => toast("Connect a new account (mock)") },
    });
    edges.push({
      id: "e-arena-add",
      source: "arena",
      target: "add-account",
      style: { stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "4 4" },
    });

    // Posts grouped by account (distribute non-published posts across accounts that include their platform)
    const visiblePosts = arenaPosts.filter((p) => p.status !== "ideas");
    const postsByAccount = new Map<string, typeof visiblePosts>();
    arena.accounts.forEach((a) => postsByAccount.set(a.id, []));
    visiblePosts.forEach((p) => {
      const match = arena.accounts.find((a) => p.platforms.includes(a.platform));
      if (match) postsByAccount.get(match.id)!.push(p);
    });

    postsByAccount.forEach((list, accId) => {
      const accIndex = arena.accounts.findIndex((a) => a.id === accId);
      const baseY = accountBaseY + accIndex * accountGap - ((list.length - 1) * 35);
      list.forEach((p, i) => {
        const id = `post-${p.id}`;
        nodes.push({
          id,
          type: "post",
          position: { x: 680, y: baseY + i * 70 },
          data: {
            caption: p.caption,
            platforms: p.platforms,
            status: p.status,
            linked: p.linked,
          },
        });
        edges.push({
          id: `e-acc-${accId}-${p.id}`,
          source: `acc-${acc.id ? "" : ""}${accId}`.replace("acc-acc-", "acc-") || `acc-${accId}`,
          target: id,
          style: { stroke: statusColor[p.status], strokeWidth: 1, opacity: 0.5 },
        });
      });
    });

    // Fix source ids above (simpler rewrite)
    // We'll rebuild edges for posts using correct IDs:
    // Remove malformed
    const cleanEdges = edges.filter((e) => !e.id.startsWith("e-acc-"));
    postsByAccount.forEach((list, accId) => {
      list.forEach((p) => {
        cleanEdges.push({
          id: `e-acc-${accId}-${p.id}`,
          source: `acc-${accId}`,
          target: `post-${p.id}`,
          style: { stroke: statusColor[p.status], strokeWidth: 1, opacity: 0.5 },
        });
      });
    });

    // Campaign chains
    const campaigns = new Map<string, typeof visiblePosts>();
    visiblePosts.forEach((p) => {
      if (p.campaign) {
        if (!campaigns.has(p.campaign)) campaigns.set(p.campaign, []);
        campaigns.get(p.campaign)!.push(p);
      }
    });

    let campaignIdx = 0;
    campaigns.forEach((list, name) => {
      const sorted = [...list].sort((a, b) => (a.seriesPosition ?? 0) - (b.seriesPosition ?? 0));
      const campaignId = `camp-${campaignIdx}`;
      nodes.push({
        id: campaignId,
        type: "campaign",
        position: { x: 980, y: 80 + campaignIdx * 220 },
        data: { name },
      });
      sorted.forEach((p, i) => {
        cleanEdges.push({
          id: `e-camp-${campaignId}-${p.id}`,
          source: i === 0 ? campaignId : `post-${sorted[i - 1].id}`,
          target: `post-${p.id}`,
          style: { stroke: "#8B5CF6", strokeWidth: 1.5, strokeDasharray: "5 5" },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#8B5CF6" },
        });
      });
      campaignIdx++;
    });

    return { initialNodes: nodes, initialEdges: cleanEdges };
  }, [arena, arenaPosts, accent.hex]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback(
    (_e: React.MouseEvent, node: Node) => {
      if (node.type === "brandDna") {
        openBrandDna(arena.id);
      } else if (node.type === "post") {
        const postId = node.id.replace("post-", "");
        const p = posts.find((x) => x.id === postId);
        if (p) {
          updatePost(p.id, {});
          openComposer(arena.id);
          toast(`Editing: ${p.caption.slice(0, 50)}…`);
        }
      } else if (node.type === "account") {
        const accId = node.id.replace("acc-", "");
        const acc = arena.accounts.find((a) => a.id === accId);
        if (acc) toast(`${acc.handle} · ${acc.type} · ${acc.platform}`);
      } else if (node.type === "arena") {
        navigate({ to: "/arenas/$arenaId", params: { arenaId: arena.id } });
      }
    },
    [arena, posts, openBrandDna, openComposer, updatePost, navigate]
  );

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full flex flex-col">
      <header
        className="flex items-center justify-between px-4 md:px-6 py-3 border-b bg-card/40 backdrop-blur"
        style={{ borderColor: accent.ring }}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/arenas/$arenaId"
            params={{ arenaId: arena.id }}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ChevronLeft size={12} /> Back to pipeline
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: accent.hex, boxShadow: `0 0 12px ${accent.hex}` }} />
            <h1 className="text-sm font-semibold">{arena.name} · Canvas</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => openBrandDna(arena.id)}>
            <Sparkles size={13} /> Brand DNA
          </Button>
          <Link to="/arenas/$arenaId" params={{ arenaId: arena.id }}>
            <Button variant="outline" size="sm">
              <LayoutGrid size={13} /> Pipeline
            </Button>
          </Link>
        </div>
      </header>
      <div className="flex-1 relative" style={{ background: "#0f1117" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2a2f3a" />
          <Controls className="!bg-card !border-border [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground" />
          <MiniMap
            className="!bg-card !border-border"
            nodeColor={(n) => {
              if (n.type === "arena") return accent.hex;
              if (n.type === "brandDna") return "#F59E0B";
              if (n.type === "campaign") return "#8B5CF6";
              if (n.type === "post") {
                const s = (n.data as { status: PostStatus }).status;
                return statusColor[s];
              }
              return "#6b7280";
            }}
            maskColor="rgba(15,17,23,0.7)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
