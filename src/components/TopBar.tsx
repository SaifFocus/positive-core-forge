import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background/80 backdrop-blur flex items-center gap-3 px-4 md:px-6">
      <div className="md:hidden flex items-center gap-2 font-semibold">
        <div className="size-7 rounded-md bg-gradient-to-br from-primary to-arena-purple" />
        Orbit
      </div>
      <div className="flex-1 max-w-xl relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search arenas, posts, accounts…"
          className="pl-9 bg-secondary border-transparent focus-visible:border-border h-9"
        />
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell size={18} />
        <span className="absolute top-2 right-2 size-2 rounded-full bg-arena-coral" />
      </Button>
      <div className="size-9 rounded-full bg-gradient-to-br from-arena-purple to-arena-blue grid place-items-center text-xs font-semibold">
        SK
      </div>
    </header>
  );
}
