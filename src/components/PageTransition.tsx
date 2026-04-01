"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { TAB_ORDER } from "./BottomNav";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [animationClass, setAnimationClass] = useState("animate-fade-in");
  const [prevIndex, setPrevIndex] = useState(() => TAB_ORDER.indexOf(pathname));

  useEffect(() => {
    if (pathname === "/login") {
      setAnimationClass("animate-fade-in");
      setDisplayChildren(children);
      return;
    }

    const currentIndex = TAB_ORDER.indexOf(pathname);
    
    // If navigating between known tabs
    if (currentIndex !== -1 && prevIndex !== -1 && currentIndex !== prevIndex) {
      if (currentIndex > prevIndex) {
        setAnimationClass("animate-slide-in-right");
      } else {
        setAnimationClass("animate-slide-in-left");
      }
    } else {
      setAnimationClass("animate-fade-in");
    }

    setPrevIndex(currentIndex);
    setDisplayChildren(children);

  }, [pathname, children, prevIndex]);

  return (
    <div key={pathname} className={`w-full h-full ${animationClass}`}>
      {displayChildren}
    </div>
  );
}
