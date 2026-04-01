"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getTemplates, deleteTemplate, addEntriesToWorkout, updateWorkout, getWorkouts } from "../../lib/firestore";
import { Template, Workout } from "../../types";
import { SkeletonList } from "../../components/Skeleton";
import { CheckCircle2, Play, Copy, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActive, setLoadingActive] = useState<string | null>(null);
  const [loadedMsg, setLoadedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getTemplates(user.uid).then(t => {
      setTemplates(t);
      setLoading(false);
    });
  }, [user]);

  const handleLoad = async (tpl: Template) => {
    if (!user) return;
    setLoadingActive(tpl.id);
    
    // We add these directly to today's workout
    const today = new Date().toISOString().split('T')[0];
    
    // Convert template entries to workout entries
    const newEntries = tpl.entries.map(e => ({
      id: crypto.randomUUID(),
      movementName: e.movementName,
      reps: e.reps,
      weight: e.weight,
      unit: e.unit,
      createdAt: Date.now()
    }));

    await addEntriesToWorkout(user.uid, today, today, newEntries);
    
    setLoadedMsg(tpl.id);
    // Timeout then redirect
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  const handleDelete = async (tpl: Template) => {
    if (!user) return;
    setTemplates(prev => prev.filter(x => x.id !== tpl.id));
    await deleteTemplate(user.uid, tpl.id);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tight">Templates</h1>
      </div>

      {loading ? (
        <SkeletonList count={4} />
      ) : templates.length === 0 ? (
        <div className="text-center pt-10 text-text-tertiary">No templates found. Save a workout as a routine first!</div>
      ) : (
        <div className="flex flex-col gap-4 animate-stagger-in">
          {templates.map(tpl => {
            const isLoaded = loadedMsg === tpl.id;
            const isLoading = loadingActive === tpl.id && !isLoaded;
            
            return (
              <div key={tpl.id} className="card-depth p-4 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold">{tpl.name}</h2>
                    <p className="text-sm text-text-tertiary mt-1">
                      {Array.from(new Set(tpl.entries.map(e => e.movementName))).join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 w-full pt-2 border-t border-border">
                  <button 
                    onClick={() => handleDelete(tpl)}
                    className="flex-1 flex justify-center py-3 bg-bg-tertiary rounded-xl text-danger font-semibold active:scale-95"
                  >
                    <Trash2 size={20} />
                  </button>
                  {/* <button className="flex-1 py-3 bg-bg-tertiary rounded-xl font-semibold active:scale-95 text-text-secondary flex justify-center">
                    <Edit2 size={20} />
                  </button> */}
                  <button 
                    onClick={() => handleLoad(tpl)}
                    disabled={isLoading || isLoaded}
                    className={`flex-[3] flex items-center justify-center gap-2 py-3 rounded-xl font-bold shadow-sm transition-all ${
                      isLoaded ? 'bg-success text-white' : 'bg-accent text-white active:scale-95 hover:bg-accent-hover'
                    }`}
                  >
                    {isLoaded ? (
                      <><CheckCircle2 size={20} /> Loaded!</>
                    ) : isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Play size={20} fill="currentColor" /> Start</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
