"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getWorkouts, updateWorkout, deleteWorkout } from "../../lib/firestore";
import { Workout } from "../../types";
import { SkeletonList } from "../../components/Skeleton";
import { ChevronDown, Trash2, CalendarDays } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  // Simple state to track which workout IDs are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;
    getWorkouts(user.uid).then(w => {
      setWorkouts(w);
      setLoading(false);
    });
  }, [user]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteWorkout = async (w: Workout) => {
    if (!user) return;
    if (confirm("Delete this entire workout forever?")) {
      setWorkouts(prev => prev.filter(x => x.id !== w.id));
      await deleteWorkout(user.uid, w.id);
    }
  };

  const groupWorkoutsByWeek = (list: Workout[]) => {
    // A simplified grouping for the UI. (Ideally you'd use date-fns for strict ISO chunks).
    // Using simple YYYY-WW or just string mapping based on week of year boundaries.
    const chunks: Record<string, Workout[]> = {};
    list.forEach(w => {
      const d = new Date(w.date);
      // Sunday is 0, getting the Sunday of this week:
      d.setDate(d.getDate() - d.getDay()); 
      const weekLabel = `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}`;
      if (!chunks[weekLabel]) chunks[weekLabel] = [];
      chunks[weekLabel].push(w);
    });
    return chunks;
  };

  const grouped = groupWorkoutsByWeek(workouts);

  return (
    <div className="flex flex-col gap-6 w-full h-full pt-6">
      <h1 className="text-2xl font-black tracking-tight">History</h1>
      
      {loading ? (
        <SkeletonList count={4} />
      ) : workouts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 text-text-tertiary pt-12">
          <CalendarDays size={48} className="opacity-20" />
          <p>No workouts logged yet.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([week, wList]) => (
          <div key={week} className="flex flex-col gap-3 animate-stagger-in">
            <h2 className="text-sm font-bold text-accent uppercase tracking-wider pl-1">{week}</h2>
            {wList.map(w => {
              const totalSets = w.entries.length;
              const uniqueMovements = Array.from(new Set(w.entries.map(e => e.movementName)));
              return (
                <div key={w.id} className="card-depth overflow-hidden transition-all duration-300">
                  {/* Header */}
                  <div 
                    onClick={() => toggleExpand(w.id)}
                    className="p-4 flex items-center gap-4 cursor-pointer hover:bg-bg-tertiary/50"
                  >
                    <div className="flex-1 flex flex-col">
                      <div className="font-bold text-lg">{new Date(w.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                      <div className="text-sm text-text-secondary truncate">
                        {uniqueMovements.join(", ")}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-accent/10 text-accent font-bold px-2.5 py-1 rounded-md text-xs">
                        {totalSets} sets
                      </div>
                      <ChevronDown size={20} className={`text-text-tertiary transition-transform mt-1 ${expanded[w.id] ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {expanded[w.id] && (
                    <div className="p-4 border-t border-border bg-bg-primary/30 flex flex-col gap-4 animate-slide-up">
                      <div className="flex justify-between items-center bg-danger/10 p-2 rounded-lg">
                        <span className="text-sm font-medium text-danger">Delete Workout</span>
                        <button onClick={() => handleDeleteWorkout(w)} className="p-2 text-danger active:scale-95 bg-danger/20 rounded-md">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      {uniqueMovements.map(mName => {
                        const mSets = w.entries.filter(e => e.movementName === mName);
                        return (
                          <div key={mName} className="flex flex-col gap-2">
                            <h3 className="font-bold border-b border-border pb-1">{mName}</h3>
                            {mSets.map((set, idx) => (
                              <div key={set.id} className="flex justify-between text-sm py-1 font-mono">
                                <span className="text-text-tertiary">Set {idx + 1}</span>
                                <span>{set.reps} × {set.weight} <span className="text-xs text-text-tertiary">{set.unit}</span></span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
