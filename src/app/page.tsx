"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { getMovements, addEntryToWorkout, getWorkouts, updateWorkout, deleteWorkout } from "../lib/firestore";
import { Movement, Workout, WorkoutEntry } from "../types";
import { WorkoutForm } from "../components/WorkoutForm";
import { WorkoutList } from "../components/WorkoutList";
import { SkeletonList } from "../components/Skeleton";
import { CheckCircle2, RotateCcw } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  // Undo state
  const [deletedSetsCache, setDeletedSetsCache] = useState<WorkoutEntry[] | null>(null);
  const [undoTimeoutId, setUndoTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Finish workout confirmation
  const [finishConfirm, setFinishConfirm] = useState(false);
  const [finishedToast, setFinishedToast] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getMovements(user.uid),
      getWorkouts(user.uid)
    ]).then(([mList, wList]) => {
      setMovements(mList);
      
      const todayW = wList.find(w => w.date === todayStr);
      setTodayWorkout(todayW || null);
      
      setLoading(false);
    });
  }, [user, todayStr]);

  const handleLogSet = async (entryData: Omit<WorkoutEntry, "id" | "createdAt">) => {
    if (!user) return;
    const newEntry: WorkoutEntry = {
      ...entryData,
      id: crypto.randomUUID(), // Next.js allows crypto.randomUUID in secure contexts
      createdAt: Date.now(),
    };

    // Optimistically update
    setTodayWorkout(prev => {
      if (prev) {
        return { ...prev, entries: [...prev.entries, newEntry] };
      }
      return {
        id: todayStr,
        date: todayStr,
        entries: [newEntry],
        createdAt: Date.now(),
        completed: false
      };
    });

    await addEntryToWorkout(user.uid, todayStr, todayStr, newEntry);
  };

  const handleRepeatLast = async () => {
    if (!todayWorkout || todayWorkout.entries.length === 0) return;
    const last = todayWorkout.entries[todayWorkout.entries.length - 1];
    const { id, createdAt, ...copy } = last;
    await handleLogSet(copy);
  };

  const handleDeleteSet = async (setId: string) => {
    if (!user || !todayWorkout) return;
    const entry = todayWorkout.entries.find(e => e.id === setId);
    if (!entry) return;
    
    // Save to undo cache
    setDeletedSetsCache([entry]);
    triggerUndoToast();

    const newEntries = todayWorkout.entries.filter(e => e.id !== setId);
    
    if (newEntries.length === 0) {
      setTodayWorkout(null);
      await deleteWorkout(user.uid, todayStr);
    } else {
      setTodayWorkout({ ...todayWorkout, entries: newEntries });
      await updateWorkout(user.uid, todayStr, { entries: newEntries });
    }
  };

  const handleDeleteMovement = async (movementName: string) => {
    if (!user || !todayWorkout) return;
    
    const setsToDelete = todayWorkout.entries.filter(e => e.movementName === movementName);
    const newEntries = todayWorkout.entries.filter(e => e.movementName !== movementName);
    
    setDeletedSetsCache(setsToDelete);
    triggerUndoToast();

    if (newEntries.length === 0) {
      setTodayWorkout(null);
      await deleteWorkout(user.uid, todayStr);
    } else {
      setTodayWorkout({ ...todayWorkout, entries: newEntries });
      await updateWorkout(user.uid, todayStr, { entries: newEntries });
    }
  };

  const onDuplicateSet = async (entry: WorkoutEntry) => {
    const { id, createdAt, ...copy } = entry;
    await handleLogSet(copy);
  };

  const triggerUndoToast = () => {
    if (undoTimeoutId) clearTimeout(undoTimeoutId);
    const tid = setTimeout(() => {
      setDeletedSetsCache(null);
    }, 5000);
    setUndoTimeoutId(tid);
  };

  const handleUndo = async () => {
    if (!user || !deletedSetsCache) return;
    if (undoTimeoutId) clearTimeout(undoTimeoutId);
    
    // Restore
    const newEntries = [...(todayWorkout?.entries || []), ...deletedSetsCache].sort((a,b) => a.createdAt - b.createdAt);
    
    const workoutToSave: Workout = {
      id: todayStr,
      date: todayStr,
      entries: newEntries,
      createdAt: todayWorkout?.createdAt || Date.now(),
      completed: false
    };

    setTodayWorkout(workoutToSave);
    
    if (!todayWorkout && newEntries.length > 0) {
      // workout was completely deleted, we need to create it again.
      // addEntryToWorkout handles creating. (or we can just append via addEntriesToWorkout)
    }

    // to be safe, we just push all entries (simpler for MVP since addEntriesToWorkout appends, we should use update)
    await updateWorkout(user.uid, todayStr, { entries: newEntries });
    
    setDeletedSetsCache(null);
  };

  const handleFinish = async () => {
    if (!finishConfirm) {
      setFinishConfirm(true);
      setTimeout(() => setFinishConfirm(false), 3000);
      return;
    }
    
    // Confirmed
    if (!user || !todayWorkout) return;
    await updateWorkout(user.uid, todayStr, { completed: true });
    
    setFinishedToast(true);
    setTimeout(() => {
      setFinishedToast(false);
      setFinishConfirm(false);
    }, 3000);
  };

  const totalSets = todayWorkout?.entries.length || 0;
  const totalWeight = todayWorkout?.entries.reduce((acc, cur) => acc + (cur.reps * cur.weight), 0) || 0;
  const lastEntry = todayWorkout?.entries[todayWorkout.entries.length - 1] || null;

  return (
    <div className="flex flex-col gap-6 w-full h-full pt-4">
      {/* Date Header */}
      <div className="flex justify-between items-center px-1">
        <h1 className="text-2xl font-black tracking-tight border-l-4 border-accent pl-2">Today</h1>
        {totalSets > 0 && (
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">{totalSets} sets</span>
            <span className="text-xs text-text-tertiary">{totalWeight} {settings.unit} vol</span>
          </div>
        )}
      </div>

      {loading ? (
        <SkeletonList count={2} />
      ) : (
         <WorkoutForm 
          movements={movements} 
          lastEntry={lastEntry} 
          unit={settings.unit as "kg"|"lbs"}
          onLogSet={handleLogSet}
          onRepeatLast={handleRepeatLast}
        />
      )}

      {!loading && todayWorkout && todayWorkout.entries.length > 0 && (
         <WorkoutList 
          entries={todayWorkout.entries} 
          onDeleteSet={handleDeleteSet}
          onDeleteMovement={handleDeleteMovement}
          onDuplicateSet={onDuplicateSet}
        />
      )}

      {/* Undo Toast */}
      {deletedSetsCache && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-bg-secondary text-text-primary px-4 py-3 rounded-full card-depth flex items-center gap-4 z-50 animate-slide-up border border-border">
          <span className="text-sm font-semibold pl-2">Deleted {deletedSetsCache.length} set{deletedSetsCache.length>1?'s':''}</span>
          <button 
            onClick={handleUndo}
            className="flex items-center gap-1 text-accent font-bold text-sm bg-accent/10 px-3 py-1.5 rounded-full active:scale-95"
          >
            <RotateCcw size={14} /> Undo
          </button>
        </div>
      )}

      {/* Finished Toast */}
      {finishedToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm animate-fade-in px-4">
          <div className="bg-success text-white card-depth p-8 rounded-2xl flex flex-col items-center gap-4 animate-modal-in max-w-xs shadow-[0_0_40px_rgba(16,185,129,0.3)] text-center">
            <CheckCircle2 size={64} className="animate-pulse-ring" />
            <div>
              <h2 className="text-2xl font-black mb-1">Great Job!</h2>
              <p className="text-sm opacity-90">{totalSets} sets • {totalWeight} {settings.unit}</p>
            </div>
          </div>
        </div>
      )}

      {totalSets > 0 && (
        <button 
          onClick={handleFinish}
          className={`mt-4 py-4 rounded-xl font-black shadow-btn-glow active:scale-95 transition-all text-lg flex justify-center items-center gap-2 ${
            finishConfirm ? "bg-danger text-white animate-pulse" : "bg-bg-secondary border-2 border-accent text-accent"
          }`}
        >
          {finishConfirm ? "Tap Again to Finish" : "Finish Workout"}
        </button>
      )}

    </div>
  );
}
