"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ClipboardList, Dumbbell, BarChart2, Settings } from "lucide-react";

export const TAB_ORDER = [
  "/",
  "/templates",
  "/movements",
  "/history",
  "/settings",
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide nav on login page
  if (pathname === "/login") return null;

  const tabs = [
    { name: "WORKOUT", path: "/", icon: Activity },
    { name: "TEMPLATES", path: "/templates", icon: ClipboardList },
    { name: "MOVEMENTS", path: "/movements", icon: Dumbbell },
    { name: "HISTORY", path: "/history", icon: BarChart2 },
    { name: "SETTINGS", path: "/settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center w-full bg-glass-bg backdrop-blur-xl border-t border-glass-border">
      <div className="flex w-full max-w-lg items-center justify-around h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 active:scale-90 transition-transform ${
                isActive
                  ? "text-accent drop-shadow-[0_0_8px_rgba(var(--accent),0.4)] scale-105"
                  : "text-text-tertiary hover:text-accent/70"
              }`}
            >
              <Icon size={24} className={isActive ? "animate-pulse-ring" : ""} />
              <span className="text-[10px] font-bold tracking-widest leading-none">
                {tab.name}
              </span>
              {/* Active Indicator Dot */}
              <div
                className={`w-1 h-1 rounded-full mt-0.5 transition-opacity ${
                  isActive ? "bg-accent opacity-100" : "opacity-0"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
