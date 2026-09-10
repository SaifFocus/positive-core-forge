import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { OrbitStoreProvider } from "@/lib/orbit-store";
import { Sidebar, MobileTabBar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { PostComposerSheet } from "@/components/PostComposerSheet";
import { BrandDnaSheet } from "@/components/BrandDnaSheet";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in orbit</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That route isn't on the radar.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something drifted off course</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try refreshing.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Orbit · Social Media Command Center" },
      { name: "description", content: "Manage every brand, every channel, from one mission control." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/orbit-icon.svg", type: "image/svg+xml" },
      { rel: "shortcut icon", href: "/orbit-icon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/orbit-icon.svg" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <OrbitStoreProvider>
        <div className="flex min-h-screen w-full bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 pb-20 md:pb-0">
              <Outlet />
            </main>
          </div>
          <MobileTabBar />
          <PostComposerSheet />
          <BrandDnaSheet />
        </div>
      </OrbitStoreProvider>
    </QueryClientProvider>
  );
}
