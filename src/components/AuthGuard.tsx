"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-bg-primary">
        <div className="flex flex-col gap-4 w-3/4 max-w-sm">
           {/* Simple skeleton loading */}
           <div className="h-32 rounded-xl skeleton w-full"></div>
           <div className="h-16 rounded-xl skeleton w-full"></div>
           <div className="h-16 rounded-xl skeleton w-full"></div>
        </div>
      </div>
    );
  }

  // Prevent flicker by not rendering children if unauthenticated and not on login page
  if (!user && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}
