import { Instagram, Twitter, Linkedin, Youtube, Music2, AtSign } from "lucide-react";
import type { Platform } from "@/lib/orbit-store";
import { platformMeta } from "@/lib/orbit-store";
import { cn } from "@/lib/utils";

const iconMap = {
  instagram: Instagram,
  tiktok: Music2,
  x: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  threads: AtSign,
} as const;

export function PlatformIcon({
  platform,
  size = 14,
  className,
}: {
  platform: Platform;
  size?: number;
  className?: string;
}) {
  const Icon = iconMap[platform];
  return (
    <Icon
      size={size}
      className={cn(className)}
      style={{ color: platformMeta[platform].color }}
      aria-label={platformMeta[platform].label}
    />
  );
}
