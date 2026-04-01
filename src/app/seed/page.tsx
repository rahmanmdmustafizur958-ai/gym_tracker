"use client";

import { useAuth } from "../../contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useState } from "react";
import { Movement, Template } from "../../types";

const defaultMovements = [
  // Legs
  { name: "Squat", category: "Legs" },
  { name: "Front Squat", category: "Legs" },
  { name: "Hack Squat", category: "Legs" },
  { name: "Leg Press", category: "Legs" },
  { name: "Romanian Deadlift", category: "Legs" },
  { name: "Walking Lunge", category: "Legs" },
  { name: "Bulgarian Split Squat", category: "Legs" },
  { name: "Leg Extension", category: "Legs" },
  { name: "Leg Curl", category: "Legs" },
  { name: "Hip Thrust", category: "Legs" },
  { name: "Calf Raise", category: "Legs" },
  { name: "Goblet Squat", category: "Legs" },
  // Back
  { name: "Deadlift", category: "Back" },
  { name: "Barbell Row", category: "Back" },
  { name: "Dumbbell Row", category: "Back" },
  { name: "Seated Cable Row", category: "Back" },
  { name: "T-Bar Row", category: "Back" },
  { name: "Pull-Up", category: "Back" },
  { name: "Chin-Up", category: "Back" },
  { name: "Lat Pulldown", category: "Back" },
  { name: "Face Pull", category: "Back" },
  { name: "Shrug", category: "Back" },
  // Chest
  { name: "Bench Press", category: "Chest" },
  { name: "Incline Bench Press", category: "Chest" },
  { name: "Dumbbell Bench Press", category: "Chest" },
  { name: "Incline Dumbbell Press", category: "Chest" },
  { name: "Cable Fly", category: "Chest" },
  { name: "Dumbbell Fly", category: "Chest" },
  { name: "Chest Dip", category: "Chest" },
  { name: "Push-Up", category: "Chest" },
  { name: "Machine Chest Press", category: "Chest" },
  // Shoulders
  { name: "Overhead Press", category: "Shoulders" },
  { name: "Dumbbell Shoulder Press", category: "Shoulders" },
  { name: "Arnold Press", category: "Shoulders" },
  { name: "Lateral Raise", category: "Shoulders" },
  { name: "Front Raise", category: "Shoulders" },
  { name: "Reverse Fly", category: "Shoulders" },
  { name: "Upright Row", category: "Shoulders" },
  // Arms
  { name: "Barbell Curl", category: "Arms" },
  { name: "Dumbbell Curl", category: "Arms" },
  { name: "Hammer Curl", category: "Arms" },
  { name: "Preacher Curl", category: "Arms" },
  { name: "Cable Curl", category: "Arms" },
  { name: "Tricep Pushdown", category: "Arms" },
  { name: "Overhead Tricep Extension", category: "Arms" },
  { name: "Skull Crusher", category: "Arms" },
  { name: "Close-Grip Bench Press", category: "Arms" },
  { name: "Tricep Dip", category: "Arms" },
  // Core
  { name: "Plank", category: "Core" },
  { name: "Hanging Leg Raise", category: "Core" },
  { name: "Cable Crunch", category: "Core" },
  { name: "Ab Wheel Rollout", category: "Core" },
  { name: "Dead Bug", category: "Core" },
  { name: "Russian Twist", category: "Core" },
  { name: "Decline Sit-Up", category: "Core" },
  // Cardio
  { name: "Running", category: "Cardio" },
  { name: "Rowing Machine", category: "Cardio" },
  { name: "Stationary Bike", category: "Cardio" },
  { name: "Jump Rope", category: "Cardio" },
  { name: "Stair Climber", category: "Cardio" },
] as Partial<Movement>[];

const defaultTemplates: Partial<Template>[] = [
  {
    name: "Push Day",
    entries: [
      { movementName: "Bench Press", reps: 8, weight: 60, unit: "kg" },
      { movementName: "Overhead Press", reps: 10, weight: 40, unit: "kg" },
      { movementName: "Lateral Raise", reps: 15, weight: 10, unit: "kg" },
      { movementName: "Tricep Pushdown", reps: 12, weight: 20, unit: "kg" },
    ]
  },
  {
    name: "Pull Day",
    entries: [
      { movementName: "Deadlift", reps: 5, weight: 100, unit: "kg" },
      { movementName: "Pull-Up", reps: 8, weight: 0, unit: "kg" },
      { movementName: "Barbell Row", reps: 10, weight: 60, unit: "kg" },
      { movementName: "Barbell Curl", reps: 12, weight: 30, unit: "kg" },
    ]
  },
  {
    name: "Leg Day",
    entries: [
      { movementName: "Squat", reps: 8, weight: 80, unit: "kg" },
      { movementName: "Leg Press", reps: 10, weight: 150, unit: "kg" },
      { movementName: "Leg Extension", reps: 15, weight: 40, unit: "kg" },
      { movementName: "Leg Curl", reps: 12, weight: 40, unit: "kg" },
    ]
  }
];

export default function SeedPage() {
  const { user } = useAuth();
  const [log, setLog] = useState<string[]>([]);

  const appendLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const seedMovements = async () => {
    if (!user) return appendLog("Not logged in");
    appendLog("Starting movements seed...");
    let cnt = 0;
    for (const mov of defaultMovements) {
      const id = mov.name!.toLowerCase().replace(/\s+/g, '-');
      const ref = doc(db, `users/${user.uid}/movements`, id);
      await setDoc(ref, {
        id,
        name: mov.name,
        category: mov.category,
        isCustom: false
      });
      cnt++;
    }
    appendLog(`Seeded ${cnt} movements.`);
  };

  const seedTemplates = async () => {
    if (!user) return appendLog("Not logged in");
    appendLog("Starting templates seed...");
    let cnt = 0;
    for (const tpl of defaultTemplates) {
      const id = tpl.name!.toLowerCase().replace(/\s+/g, '-');
      const ref = doc(db, `users/${user.uid}/templates`, id);
      await setDoc(ref, {
        id,
        name: tpl.name,
        entries: tpl.entries,
        createdAt: Date.now(),
        order: cnt,
      });
      cnt++;
    }
    appendLog(`Seeded ${cnt} templates.`);
  };

  return (
    <div className="p-4 pt-12 max-w-lg mx-auto w-full h-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dev Utility / Seed Data</h1>
      
      <div className="flex flex-col gap-3">
        <button onClick={seedMovements} className="bg-accent text-white p-3 rounded">
          Seed 60+ Default Movements
        </button>
        <button onClick={seedTemplates} className="bg-success text-white p-3 rounded">
          Seed 3 Built-in Templates
        </button>
      </div>

      <div className="bg-bg-tertiary p-4 rounded text-sm font-mono h-[300px] overflow-y-auto">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
