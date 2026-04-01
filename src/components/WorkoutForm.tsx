"use client";

import { useState, useEffect, useRef } from "react";
import { Movement, WorkoutEntry } from "../types";
import { Play } from "lucide-react";

interface WorkoutFormProps {
  movements: Movement[];
  lastEntry: WorkoutEntry | null;
  unit: "kg" | "lbs";
  onLogSet: (entry: Omit<WorkoutEntry, "id" | "createdAt">) => Promise<void>;
  onRepeatLast: () => Promise<void>;
}

export function WorkoutForm({ movements, lastEntry, unit, onLogSet, onRepeatLast }: WorkoutFormProps) {
  const [movementName, setMovementName] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [suggestions, setSuggestions] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Autocomplete logic
  useEffect(() => {
    if (movementName.trim().length > 0) {
      const match = movements
        .filter(m => m.name.toLowerCase().includes(movementName.toLowerCase()))
        .slice(0, 8);
      // Only show if it's not an exact match already typed
      if (match.length === 1 && match[0].name.toLowerCase() === movementName.toLowerCase()) {
        setSuggestions([]);
      } else {
        setSuggestions(match);
      }
    } else {
      setSuggestions([]);
    }
  }, [movementName, movements]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementName || !reps || !weight) return;

    setLoading(true);
    await onLogSet({
      movementName: movementName.trim(),
      reps: Number(reps),
      weight: Number(weight),
      unit,
      notes: notes.trim() || undefined,
    });
    setLoading(false);

    // Keep movement name, reset others except weight? The prompt doesn't specify deeply but says:
    // "After logging, re-focus the movement input for fast consecutive logging"
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={movementName}
          onChange={(e) => setMovementName(e.target.value)}
          placeholder="Movement name"
          required
          className="w-full bg-bg-secondary text-lg py-3.5 px-4 rounded-xl border border-border outline-none focus:ring-2 focus:ring-accent transition-all card-depth"
        />
        {/* Autocomplete Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-bg-secondary border border-border rounded-xl shadow-lg z-20 overflow-hidden flex flex-col">
            {suggestions.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setMovementName(s.name);
                  setSuggestions([]);
                }}
                className={`text-left px-4 py-3 hover:bg-bg-tertiary active:bg-bg-tertiary transition-colors ${
                  idx !== suggestions.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="Reps"
          required
          min="1"
          className="w-1/2 bg-bg-secondary text-lg font-mono text-center py-3.5 px-4 rounded-xl border border-border outline-none focus:ring-2 focus:ring-accent transition-all card-depth"
        />
        <div className="relative w-1/2">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight"
            required
            step="0.5"
            min="0"
            className="w-full bg-bg-secondary text-lg font-mono text-center py-3.5 pr-8 rounded-xl border border-border outline-none focus:ring-2 focus:ring-accent transition-all card-depth"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-tertiary font-bold uppercase pointer-events-none">
            {unit}
          </span>
        </div>
      </div>

      {showNotes && (
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="w-full bg-bg-tertiary text-sm py-2.5 px-4 rounded-lg border border-border outline-none focus:ring-1 focus:ring-accent animate-slide-up"
        />
      )}

      <div className="flex gap-2 w-full mt-1">
        <button
          type="submit"
          disabled={loading || !movementName || !reps || !weight}
          className="flex-[2] bg-accent text-text-on-accent font-black text-lg py-3.5 rounded-xl shadow-btn-glow active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex justify-center items-center gap-2"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Log Set</>
          )}
        </button>

        {lastEntry && (
          <button
            type="button"
            onClick={onRepeatLast}
            className="flex-1 bg-bg-tertiary text-text-secondary font-bold text-sm py-3.5 rounded-xl active:scale-[0.96] transition-all border border-border leading-tight flex flex-col items-center justify-center overflow-hidden px-1"
          >
            <span className="text-xs font-medium truncate w-full text-center text-text-tertiary">Repeat</span>
            <span className="truncate w-full text-center">{lastEntry.movementName}</span>
          </button>
        )}
      </div>

      {!showNotes && (
        <button 
          type="button" 
          onClick={() => setShowNotes(true)}
          className="text-xs text-text-tertiary font-bold uppercase tracking-wider self-center mt-2 hover:text-accent transition-colors"
        >
          + Add Notes
        </button>
      )}
    </form>
  );
}
