import * as React from "react";
import { useOrbit, platformMeta, type Platform, type PostStatus } from "@/lib/orbit-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/PlatformIcon";
import { cn } from "@/lib/utils";
import { Sparkles, Link2, Calendar, Save, Send } from "lucide-react";

const ALL_PLATFORMS: Platform[] = ["instagram", "tiktok", "x", "linkedin", "youtube", "threads"];

export function PostComposerSheet() {
  const { composerOpen, closeComposer, composerArenaId, arenas, addPost } = useOrbit();
  const arena = arenas.find((a) => a.id === composerArenaId) ?? arenas[0];

  const [platforms, setPlatforms] = React.useState<Platform[]>(["instagram", "x"]);
  const [caption, setCaption] = React.useState("");
  const [applyVoice, setApplyVoice] = React.useState(true);
  const [showVariants, setShowVariants] = React.useState(false);
  const [linkCampaign, setLinkCampaign] = React.useState(false);
  const [campaign, setCampaign] = React.useState("");
  const [seriesPos, setSeriesPos] = React.useState("1");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    if (composerOpen) {
      setPlatforms(["instagram", "x"]);
      setCaption("");
      setApplyVoice(true);
      setShowVariants(false);
      setLinkCampaign(false);
      setCampaign("");
      setSeriesPos("1");
      setDate("");
      setTime("");
    }
  }, [composerOpen]);

  function toggle(p: Platform) {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function submit(status: PostStatus) {
    if (!arena) return;
    const scheduledAt = date && time ? `${date} · ${time}` : undefined;
    addPost({
      arenaId: arena.id,
      caption: caption || "(untitled draft)",
      platforms,
      status,
      scheduledAt,
      campaign: linkCampaign ? campaign : undefined,
      seriesPosition: linkCampaign ? Number(seriesPos) : undefined,
      linked: linkCampaign || undefined,
      variants: showVariants ? platforms.length : undefined,
    });
    closeComposer();
  }

  if (!arena) return null;

  return (
    <Sheet open={composerOpen} onOpenChange={(o) => !o && closeComposer()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-surface">
        <SheetHeader>
          <SheetTitle>New post · {arena.name}</SheetTitle>
          <SheetDescription>
            Compose once. Publish across {platforms.length} platform{platforms.length === 1 ? "" : "s"}.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Platforms</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_PLATFORMS.map((p) => {
                const on = platforms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggle(p)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors",
                      on
                        ? "bg-primary/15 border-primary text-foreground"
                        : "bg-secondary border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <PlatformIcon platform={p} />
                    {platformMeta[p].label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Caption</Label>
              <div className="flex flex-wrap gap-1.5">
                {platforms.map((p) => {
                  const limit = platformMeta[p].charLimit;
                  const over = caption.length > limit;
                  return (
                    <span
                      key={p}
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded font-mono",
                        over ? "bg-destructive/20 text-destructive" : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {platformMeta[p].short} {caption.length}/{limit}
                    </span>
                  );
                })}
              </div>
            </div>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write the hook… then the meat… then the ask."
              className="min-h-32 bg-background border-border"
            />
          </section>

          <section className="flex items-center justify-between rounded-md border bg-background/60 p-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <div>
                <div className="text-sm font-medium">Apply Brand Voice</div>
                <div className="text-xs text-muted-foreground">Tone: {arena.brandDna.tone.slice(0, 48)}…</div>
              </div>
            </div>
            <Switch checked={applyVoice} onCheckedChange={setApplyVoice} />
          </section>

          <section>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowVariants((v) => !v)}
            >
              <Sparkles size={14} />
              {showVariants ? "Hide" : "Generate"} platform variants
            </Button>
            {showVariants && (
              <div className="mt-3 space-y-2">
                {platforms.map((p) => (
                  <div key={p} className="rounded-md border bg-background p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <PlatformIcon platform={p} />
                      <span className="text-xs font-medium">{platformMeta[p].label} variant</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {variantPreview(caption || "Your idea here", p)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-md border bg-background/60 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 size={16} className="text-primary" />
                <span className="text-sm font-medium">Link to campaign</span>
              </div>
              <Switch checked={linkCampaign} onCheckedChange={setLinkCampaign} />
            </div>
            {linkCampaign && (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label className="text-xs">Campaign</Label>
                  <Input
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    placeholder="e.g. Notes Series"
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label className="text-xs">Position</Label>
                  <Input
                    value={seriesPos}
                    onChange={(e) => setSeriesPos(e.target.value)}
                    placeholder="1"
                    className="bg-background"
                  />
                </div>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={14} className="text-primary" />
              <Label>Schedule</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-background" />
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-background" />
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row gap-2 pb-4">
          <Button variant="outline" className="flex-1" onClick={() => submit("drafts")}>
            <Save size={14} /> Save Draft
          </Button>
          <Button variant="secondary" className="flex-1" onClick={() => submit("scheduled")}>
            <Calendar size={14} /> Schedule
          </Button>
          <Button className="flex-1" onClick={() => submit("published")}>
            <Send size={14} /> Publish Now
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function variantPreview(text: string, p: Platform) {
  if (p === "x") return `${text.slice(0, 200)}${text.length > 200 ? "…" : ""}  ↓ thread`;
  if (p === "linkedin") return `${text}\n\nWhat's your take? — would love to hear.`;
  if (p === "instagram") return `${text}\n.\n.\n#buildinpublic #design`;
  if (p === "tiktok") return `POV: ${text}`;
  if (p === "threads") return text.slice(0, 480);
  return `${text} — full video on the channel.`;
}

// re-export so importers can use a single Badge alias if needed
export { Badge };
