import * as React from "react";
import { useOrbit, platformMeta, type Platform, type BrandDNA } from "@/lib/orbit-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Save } from "lucide-react";

const cadenceOptions = ["Daily", "3x week", "Weekly", "Custom"];

export function BrandDnaSheet() {
  const { brandDnaOpen, brandDnaArenaId, arenas, closeBrandDna, updateBrandDna } = useOrbit();
  const arena = arenas.find((a) => a.id === brandDnaArenaId);
  const [dna, setDna] = React.useState<BrandDNA | null>(null);

  React.useEffect(() => {
    if (brandDnaOpen && arena) {
      setDna(JSON.parse(JSON.stringify(arena.brandDna)));
    }
  }, [brandDnaOpen, arena]);

  if (!arena || !dna) {
    return (
      <Sheet open={brandDnaOpen} onOpenChange={(o) => !o && closeBrandDna()}>
        <SheetContent />
      </Sheet>
    );
  }

  function save() {
    if (!arena || !dna) return;
    updateBrandDna(arena.id, dna);
    closeBrandDna();
  }

  return (
    <Sheet open={brandDnaOpen} onOpenChange={(o) => !o && closeBrandDna()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-surface">
        <SheetHeader>
          <SheetTitle>Brand DNA · {arena.name}</SheetTitle>
          <SheetDescription>The instructions every post in this Arena follows.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section className="space-y-2">
            <Label>Tone of voice</Label>
            <Textarea
              value={dna.tone}
              onChange={(e) => setDna({ ...dna, tone: e.target.value })}
              className="min-h-24 bg-background"
            />
          </section>

          <TagSection
            label="Content pillars"
            hint="Up to 6"
            max={6}
            values={dna.pillars}
            onChange={(v) => setDna({ ...dna, pillars: v })}
            placeholder="e.g. Building in public"
          />

          <section className="space-y-3">
            <Label>Hashtag sets</Label>
            {(["primary", "secondary", "niche"] as const).map((group) => (
              <TagSection
                key={group}
                label={group.charAt(0).toUpperCase() + group.slice(1)}
                values={dna.hashtags[group]}
                onChange={(v) => setDna({ ...dna, hashtags: { ...dna.hashtags, [group]: v } })}
                placeholder="#tag"
                compact
              />
            ))}
          </section>

          <section className="space-y-2">
            <Label>Post cadence</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(platformMeta) as Platform[]).map((p) => (
                <div key={p}>
                  <Label className="text-xs text-muted-foreground">{platformMeta[p].label}</Label>
                  <select
                    value={dna.cadence[p] ?? ""}
                    onChange={(e) =>
                      setDna({ ...dna, cadence: { ...dna.cadence, [p]: e.target.value || undefined } })
                    }
                    className="w-full h-9 px-3 rounded-md bg-background border text-sm"
                  >
                    <option value="">—</option>
                    {cadenceOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <Label>Visual identity notes</Label>
            <Textarea
              value={dna.visualNotes}
              onChange={(e) => setDna({ ...dna, visualNotes: e.target.value })}
              className="min-h-24 bg-background"
            />
          </section>
        </div>

        <div className="mt-8 pb-4">
          <Button className="w-full" onClick={save}>
            <Save size={14} /> Save Brand DNA
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function TagSection({
  label,
  hint,
  max,
  values,
  onChange,
  placeholder,
  compact,
}: {
  label: string;
  hint?: string;
  max?: number;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  compact?: boolean;
}) {
  const [input, setInput] = React.useState("");
  function add() {
    const v = input.trim();
    if (!v) return;
    if (max && values.length >= max) return;
    if (values.includes(v)) return;
    onChange([...values, v]);
    setInput("");
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className={compact ? "text-xs text-muted-foreground" : ""}>{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <div className="flex flex-wrap gap-1.5 min-h-8">
        {values.map((v) => (
          <Badge key={v} variant="secondary" className="gap-1 pr-1">
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="hover:text-destructive"
            >
              <X size={11} />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="bg-background"
        />
        <Button type="button" variant="outline" onClick={add}>
          Add
        </Button>
      </div>
    </div>
  );
}
