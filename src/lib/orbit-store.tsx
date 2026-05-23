import * as React from "react";

export type Platform = "instagram" | "tiktok" | "x" | "linkedin" | "youtube" | "threads";
export type AccountType = "primary" | "burner";
export type PostStatus = "ideas" | "drafts" | "scheduled" | "published";
export type ArenaColor = "coral" | "amber" | "teal" | "purple" | "blue" | "green";

export interface SocialAccount {
  id: string;
  platform: Platform;
  handle: string;
  type: AccountType;
  lastPostAt?: string;
}

export interface BrandDNA {
  tone: string;
  pillars: string[];
  hashtags: { primary: string[]; secondary: string[]; niche: string[] };
  cadence: Partial<Record<Platform, string>>;
  visualNotes: string;
}

export interface Post {
  id: string;
  arenaId: string;
  caption: string;
  platforms: Platform[];
  status: PostStatus;
  scheduledAt?: string;
  variants?: number;
  campaign?: string;
  seriesPosition?: number;
  linked?: boolean;
  publishedAt?: string;
}

export interface Arena {
  id: string;
  name: string;
  color: ArenaColor;
  accounts: SocialAccount[];
  brandDna: BrandDNA;
}

interface StoreState {
  arenas: Arena[];
  posts: Post[];
  addPost: (p: Omit<Post, "id">) => void;
  updatePost: (id: string, p: Partial<Post>) => void;
  movePost: (id: string, status: PostStatus) => void;
  updateBrandDna: (arenaId: string, dna: BrandDNA) => void;
  composerOpen: boolean;
  composerArenaId: string | null;
  openComposer: (arenaId: string) => void;
  closeComposer: () => void;
  brandDnaOpen: boolean;
  brandDnaArenaId: string | null;
  openBrandDna: (arenaId: string) => void;
  closeBrandDna: () => void;
}

const arenaSeeds: Arena[] = [
  {
    id: "personal",
    name: "Personal Brand",
    color: "coral",
    accounts: [
      { id: "a1", platform: "instagram", handle: "@saif_creates", type: "primary", lastPostAt: "2h ago" },
      { id: "a2", platform: "tiktok", handle: "@saif_tt", type: "primary", lastPostAt: "1d ago" },
      { id: "a3", platform: "x", handle: "@saifx", type: "primary", lastPostAt: "4h ago" },
      { id: "a4", platform: "instagram", handle: "@burnr_01", type: "burner", lastPostAt: "5d ago" },
    ],
    brandDna: {
      tone: "Witty, candid, builder energy. First-person stories with sharp takeaways.",
      pillars: ["Building in public", "Design craft", "Founder life", "Tooling deep-dives"],
      hashtags: {
        primary: ["#buildinpublic", "#indiehackers"],
        secondary: ["#startup", "#designtools", "#productivity"],
        niche: ["#solopreneur", "#shipfast", "#dxn"],
      },
      cadence: { instagram: "Daily", tiktok: "3x week", x: "Daily" },
      visualNotes: "Warm tones, hand-drawn annotations, screenshots over stock. Lowercase captions.",
    },
  },
  {
    id: "luxeco",
    name: "Luxe Co",
    color: "amber",
    accounts: [
      { id: "b1", platform: "instagram", handle: "@luxeco_official", type: "primary", lastPostAt: "6h ago" },
      { id: "b2", platform: "linkedin", handle: "@luxeco", type: "primary", lastPostAt: "2d ago" },
    ],
    brandDna: {
      tone: "Editorial, restrained, aspirational. Long-form vignettes, no exclamation marks.",
      pillars: ["Craftsmanship", "Provenance", "Atelier stories", "Seasonal capsule"],
      hashtags: {
        primary: ["#luxeco", "#quietluxury"],
        secondary: ["#madeinitaly", "#timelessdesign"],
        niche: ["#savoirfaire", "#slowfashion"],
      },
      cadence: { instagram: "3x week", linkedin: "Weekly" },
      visualNotes: "Muted earth palette, generous whitespace, serif overlays, 4:5 ratio hero.",
    },
  },
  {
    id: "side",
    name: "Side Project",
    color: "teal",
    accounts: [
      { id: "c1", platform: "instagram", handle: "@proj_ig", type: "primary", lastPostAt: "1d ago" },
      { id: "c2", platform: "tiktok", handle: "@ghost_02", type: "burner", lastPostAt: "3d ago" },
    ],
    brandDna: {
      tone: "Curious, playful, experimental. Short hooks. Lots of questions.",
      pillars: ["MVP experiments", "Behind the scenes", "User reactions"],
      hashtags: {
        primary: ["#sideproject", "#sundayshipping"],
        secondary: ["#nocode", "#tinytools"],
        niche: ["#weekendbuild"],
      },
      cadence: { instagram: "Weekly", tiktok: "Weekly" },
      visualNotes: "Neon accents, glitch transitions, fast-paced cuts.",
    },
  },
];

const postSeeds: Post[] = [
  // Personal — 2 ideas, 3 drafts, 4 scheduled, 6 published
  { id: "p1", arenaId: "personal", caption: "Tiny story: the bug that taught me to read changelogs.", platforms: ["x", "threads"], status: "ideas" },
  { id: "p2", arenaId: "personal", caption: "Carousel idea: 7 design tokens I rename on every project.", platforms: ["instagram", "linkedin"], status: "ideas", variants: 2 },
  { id: "p3", arenaId: "personal", caption: "Building Orbit in public — week 3 update. Shipped the pipeline view today.", platforms: ["x"], status: "drafts" },
  { id: "p4", arenaId: "personal", caption: "Hot take: most onboarding flows ask too early.", platforms: ["linkedin", "x"], status: "drafts", variants: 3 },
  { id: "p5", arenaId: "personal", caption: "Three Figma plugins I open every single day.", platforms: ["instagram"], status: "drafts" },
  { id: "p6", arenaId: "personal", caption: "Reel: studio reset Monday morning.", platforms: ["instagram", "tiktok"], status: "scheduled", scheduledAt: "Today · 6:30 PM", variants: 2 },
  { id: "p7", arenaId: "personal", caption: "Thread: my note-taking system, 2026 edition.", platforms: ["x"], status: "scheduled", scheduledAt: "Tomorrow · 9:00 AM", linked: true, campaign: "Notes Series", seriesPosition: 1 },
  { id: "p8", arenaId: "personal", caption: "Behind the build: how I name CSS variables.", platforms: ["instagram", "tiktok"], status: "scheduled", scheduledAt: "Wed · 12:00 PM" },
  { id: "p9", arenaId: "personal", caption: "Quiet Friday. Sharing the desk setup.", platforms: ["instagram"], status: "scheduled", scheduledAt: "Fri · 5:00 PM" },
  { id: "p10", arenaId: "personal", caption: "Why I stopped chasing follower count.", platforms: ["x", "threads"], status: "published", publishedAt: "2d ago" },
  { id: "p11", arenaId: "personal", caption: "Carousel: 5 micro-interactions worth the effort.", platforms: ["instagram"], status: "published", publishedAt: "3d ago" },
  { id: "p12", arenaId: "personal", caption: "Reel: morning routine, no chairs.", platforms: ["tiktok"], status: "published", publishedAt: "4d ago" },
  { id: "p13", arenaId: "personal", caption: "Hot take that did numbers on LinkedIn.", platforms: ["linkedin"], status: "published", publishedAt: "5d ago" },
  { id: "p14", arenaId: "personal", caption: "Thread: lessons from launching a side project.", platforms: ["x"], status: "published", publishedAt: "6d ago" },
  { id: "p15", arenaId: "personal", caption: "Reflective post on burnout and pacing.", platforms: ["instagram", "threads"], status: "published", publishedAt: "1w ago" },

  // Luxe Co — 1 idea, 2 drafts, 5 scheduled, 3 published
  { id: "l1", arenaId: "luxeco", caption: "Story: atelier in Milan, the leather supplier we've used for 40 years.", platforms: ["instagram", "linkedin"], status: "ideas" },
  { id: "l2", arenaId: "luxeco", caption: "Capsule reveal — Édition Neuf. Five pieces only.", platforms: ["instagram"], status: "drafts", variants: 2 },
  { id: "l3", arenaId: "luxeco", caption: "Founder note: what 'quiet luxury' actually means to us.", platforms: ["linkedin"], status: "drafts" },
  { id: "l4", arenaId: "luxeco", caption: "Lookbook frame 01. Tailored coat, hand-finished.", platforms: ["instagram"], status: "scheduled", scheduledAt: "Today · 8:00 PM" },
  { id: "l5", arenaId: "luxeco", caption: "Process video: the 14-step hem on the Modena trouser.", platforms: ["instagram"], status: "scheduled", scheduledAt: "Tomorrow · 11:00 AM", linked: true, campaign: "Process Series", seriesPosition: 2 },
  { id: "l6", arenaId: "luxeco", caption: "Atelier portrait — 30 years at the bench.", platforms: ["linkedin"], status: "scheduled", scheduledAt: "Thu · 10:00 AM" },
  { id: "l7", arenaId: "luxeco", caption: "Capsule teaser: cashmere series.", platforms: ["instagram"], status: "scheduled", scheduledAt: "Fri · 7:00 PM" },
  { id: "l8", arenaId: "luxeco", caption: "Press feature roundup, autumn.", platforms: ["linkedin"], status: "scheduled", scheduledAt: "Sun · 2:00 PM" },
  { id: "l9", arenaId: "luxeco", caption: "Lookbook frame 02 — published last week.", platforms: ["instagram"], status: "published", publishedAt: "5d ago" },
  { id: "l10", arenaId: "luxeco", caption: "Founder essay on slow growth.", platforms: ["linkedin"], status: "published", publishedAt: "1w ago" },
  { id: "l11", arenaId: "luxeco", caption: "Heritage post — the original 1962 sketch.", platforms: ["instagram"], status: "published", publishedAt: "2w ago" },

  // Side — 3 ideas, 1 draft, 2 scheduled, 1 published
  { id: "s1", arenaId: "side", caption: "Idea: vote on the next feature. Three options.", platforms: ["instagram", "tiktok"], status: "ideas" },
  { id: "s2", arenaId: "side", caption: "Idea: time-lapse of the bug fix.", platforms: ["tiktok"], status: "ideas" },
  { id: "s3", arenaId: "side", caption: "Idea: meme about the empty state we shipped.", platforms: ["instagram"], status: "ideas" },
  { id: "s4", arenaId: "side", caption: "Draft: weekly changelog post.", platforms: ["instagram"], status: "drafts" },
  { id: "s5", arenaId: "side", caption: "User reaction reel — first onboarding test.", platforms: ["tiktok"], status: "scheduled", scheduledAt: "Today · 9:30 PM", variants: 2 },
  { id: "s6", arenaId: "side", caption: "Sunday shipping post — what went live this week.", platforms: ["instagram"], status: "scheduled", scheduledAt: "Sun · 6:00 PM" },
  { id: "s7", arenaId: "side", caption: "Launch announcement — first 100 users.", platforms: ["instagram", "tiktok"], status: "published", publishedAt: "1w ago" },
];

const StoreContext = React.createContext<StoreState | null>(null);

export function OrbitStoreProvider({ children }: { children: React.ReactNode }) {
  const [arenas, setArenas] = React.useState<Arena[]>(arenaSeeds);
  const [posts, setPosts] = React.useState<Post[]>(postSeeds);
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [composerArenaId, setComposerArenaId] = React.useState<string | null>(null);
  const [brandDnaOpen, setBrandDnaOpen] = React.useState(false);
  const [brandDnaArenaId, setBrandDnaArenaId] = React.useState<string | null>(null);

  const value: StoreState = {
    arenas,
    posts,
    addPost: (p) => setPosts((prev) => [...prev, { ...p, id: `np-${Date.now()}` }]),
    updatePost: (id, patch) =>
      setPosts((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    movePost: (id, status) =>
      setPosts((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x))),
    updateBrandDna: (arenaId, dna) =>
      setArenas((prev) => prev.map((a) => (a.id === arenaId ? { ...a, brandDna: dna } : a))),
    composerOpen,
    composerArenaId,
    openComposer: (arenaId) => {
      setComposerArenaId(arenaId);
      setComposerOpen(true);
    },
    closeComposer: () => setComposerOpen(false),
    brandDnaOpen,
    brandDnaArenaId,
    openBrandDna: (arenaId) => {
      setBrandDnaArenaId(arenaId);
      setBrandDnaOpen(true);
    },
    closeBrandDna: () => setBrandDnaOpen(false),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useOrbit() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useOrbit must be used within OrbitStoreProvider");
  return ctx;
}

export const arenaAccent: Record<ArenaColor, { hex: string; bg: string; ring: string }> = {
  coral: { hex: "#FF6B6B", bg: "rgba(255,107,107,0.12)", ring: "rgba(255,107,107,0.4)" },
  amber: { hex: "#F59E0B", bg: "rgba(245,158,11,0.12)", ring: "rgba(245,158,11,0.4)" },
  teal: { hex: "#14B8A6", bg: "rgba(20,184,166,0.12)", ring: "rgba(20,184,166,0.4)" },
  purple: { hex: "#8B5CF6", bg: "rgba(139,92,246,0.12)", ring: "rgba(139,92,246,0.4)" },
  blue: { hex: "#3B82F6", bg: "rgba(59,130,246,0.12)", ring: "rgba(59,130,246,0.4)" },
  green: { hex: "#10B981", bg: "rgba(16,185,129,0.12)", ring: "rgba(16,185,129,0.4)" },
};

export const platformMeta: Record<Platform, { label: string; color: string; charLimit: number; short: string }> = {
  instagram: { label: "Instagram", color: "#E1306C", charLimit: 2200, short: "IG" },
  tiktok: { label: "TikTok", color: "#ffffff", charLimit: 2200, short: "TT" },
  x: { label: "X", color: "#ffffff", charLimit: 280, short: "X" },
  linkedin: { label: "LinkedIn", color: "#0077B5", charLimit: 3000, short: "LI" },
  youtube: { label: "YouTube", color: "#FF0000", charLimit: 5000, short: "YT" },
  threads: { label: "Threads", color: "#ffffff", charLimit: 500, short: "TH" },
};
