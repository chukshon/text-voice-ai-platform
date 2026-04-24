import React from "react";
import { NAV_LINKS } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AudioWaveform } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme.toggle";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div>
      <aside className="fixed inset-y-0 left-0 z-30 flex w-56 flex-col border-r border-border/50 bg-card/30">
        <div className="flex h-14 items-center gap-2.5 px-5">
          <div className="flex size-7 items-center justify-center rounded-md bg-foreground">
            <AudioWaveform className="size-3.5 text-background" />
          </div>
          <span className="text-sm font-bold tracking-tight">Text to Voice AI</span>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-3">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-foreground/8 text-foreground"
                    : "text-muted-foreground hover:bg-foreground/4 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-between border-t border-border/50 px-5 py-3">
          <ThemeToggle />
        </div>
      </aside>

      <main className="flex-1 pl-56">{children}</main>
    </div>
  );
};

export default AppLayout;
