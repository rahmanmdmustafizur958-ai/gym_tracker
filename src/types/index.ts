export type MovementCategory =
  | "Legs"
  | "Back"
  | "Chest"
  | "Shoulders"
  | "Arms"
  | "Core"
  | "Cardio"
  | "Other";

export interface Movement {
  id: string; // Document ID
  name: string;
  category: MovementCategory;
  isCustom: boolean;
}

export interface WorkoutEntry {
  id: string; // Unique ID (e.g. uuid)
  movementName: string;
  reps: number;
  weight: number;
  unit: "kg" | "lbs";
  notes?: string;
  createdAt: number; // timestamp
}

export interface Workout {
  id: string; // Document ID (usually same concept as the date or sequential ID)
  date: string; // YYYY-MM-DD
  entries: WorkoutEntry[];
  createdAt: number; // timestamp
  completed: boolean;
}

export interface TemplateEntry {
  movementName: string;
  reps: number;
  weight: number;
  unit: "kg" | "lbs";
}

export interface Template {
  id: string; // Document ID
  name: string;
  entries: TemplateEntry[];
  createdAt: number;
  order: number;
}

export interface UserSettings {
  unit: "kg" | "lbs";
  theme: "system" | "light" | "dark";
}
