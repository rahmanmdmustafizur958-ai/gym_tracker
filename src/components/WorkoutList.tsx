"use client";

import { WorkoutEntry } from "../types";
import { Trash2, Copy, Check } from "lucide-react";

interface WorkoutListProps {
  entries: WorkoutEntry[];
  onDeleteSet: (id: string) => void;
  onDeleteMovement: (movementName: string) => void;
  onDuplicateSet: (entry: WorkoutEntry) => void;
}

export function WorkoutList({ entries, onDeleteSet, onDeleteMovement, onDuplicateSet }: WorkoutListProps) {
  if (entries.length === 0) return null;

  // Group by movement
  const groups: Record<string, WorkoutEntry[]> = {};
  entries.forEach(e => {
    if (!groups[e.movementName]) {
      groups[e.movementName] = [];
    }
    groups[e.movementName].push(e);
  });

  return (
    <div className="flex flex-col gap-6 w-full animate-stagger-in px-1">
      {Object.entries(groups).map(([movementName, sets]) => (
        <div key={movementName} className="flex flex-col gap-2">
          
          <div className="flex justify-between items-end border-b border-border pb-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">{movementName}</h2>
              <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded text-center">
                {sets.length}
              </span>
            </div>
            <button 
              onClick={() => onDeleteMovement(movementName)}
              className="p-1 mb-1 text-text-tertiary hover:text-danger active:scale-90"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {sets.map((set, i) => (
              <div key={set.id} className="group flex justify-between items-center p-3 bg-bg-secondary card-depth rounded-xl border border-transparent shadow-sm">
                
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold text-text-tertiary bg-bg-tertiary w-6 h-6 flex items-center justify-center rounded-full">
                    {i+1}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-mono font-bold text-base">
                      {set.reps} × {set.weight} <span className="text-xs font-sans text-text-secondary">{set.unit}</span>
                    </div>
                    {set.notes && (
                      <span className="text-xs text-text-tertiary italic">{set.notes}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onDuplicateSet(set)}
                    className="p-2 text-text-tertiary hover:text-accent bg-bg-tertiary rounded-lg active:scale-90"
                  >
                    <Copy size={16} />
                  </button>
                  <button 
                    onClick={() => onDeleteSet(set.id)}
                    className="p-2 text-text-tertiary hover:text-danger bg-bg-tertiary rounded-lg active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
