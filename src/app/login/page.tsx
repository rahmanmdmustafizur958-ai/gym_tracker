"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { Activity, X } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await login();
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-full flex-col items-center justify-center p-4 pt-16 animate-fade-in relative z-10">
      
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[80px] -z-10" />

      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)] saturate-150">
          <Activity size={32} className="text-text-on-accent" />
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Gym Logger</h1>
        <p className="text-text-secondary text-center max-w-xs">
          Your personal workout diary. Simple, fast, and stays out of your way.
        </p>
      </div>

      <div className="card-depth w-full max-w-sm p-6 flex flex-col gap-4">
        {error && (
          <div className="flex items-start justify-between bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl text-sm">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-2 mt-0.5 opacity-70 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-bg-secondary text-text-primary border border-border py-4 rounded-xl font-semibold shadow-sm active:scale-95 transition-all outline-none focus:ring-2 focus:ring-accent"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-text-tertiary border-t-accent rounded-full animate-spin" />
          ) : (
            <>
              {/* Google SVG Logo (Inline) */}
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>
      </div>

    </div>
  );
}
