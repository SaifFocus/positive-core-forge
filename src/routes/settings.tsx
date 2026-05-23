import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · Orbit" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Workspace preferences and integrations.</p>
      </header>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div>
          <div className="text-sm font-medium">Workspace</div>
          <div className="text-xs text-muted-foreground mt-0.5">Orbit · personal plan</div>
        </div>
        <div className="border-t pt-4">
          <div className="text-sm font-medium">Connected platforms</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Instagram, TikTok, X, LinkedIn, YouTube, Threads — all OAuth available.
          </div>
        </div>
        <div className="border-t pt-4">
          <div className="text-sm font-medium">Theme</div>
          <div className="text-xs text-muted-foreground mt-0.5">Always-on dark mode (Orbit signature).</div>
        </div>
      </div>
    </div>
  );
}
