import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc,
  query,
  orderBy,
  where,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { Workout, WorkoutEntry, Movement, Template, UserSettings } from "../types";

// ==========================================
// WORKOUTS
// ==========================================

export async function addEntriesToWorkout(
  userId: string, 
  workoutId: string, 
  date: string, 
  newEntries: WorkoutEntry[]
) {
  const workoutRef = doc(db, `users/${userId}/workouts`, workoutId);
  const snap = await getDoc(workoutRef);
  
  if (snap.exists()) {
    const existingData = snap.data() as Workout;
    await updateDoc(workoutRef, {
      entries: [...existingData.entries, ...newEntries]
    });
  } else {
    const newWorkout: Workout = {
      id: workoutId,
      date,
      entries: newEntries,
      createdAt: Date.now(),
      completed: false
    };
    await setDoc(workoutRef, newWorkout);
  }
}

export async function addEntryToWorkout(
  userId: string, 
  workoutId: string, 
  date: string, 
  entry: WorkoutEntry
) {
  return addEntriesToWorkout(userId, workoutId, date, [entry]);
}

export async function getWorkouts(userId: string): Promise<Workout[]> {
  const workoutsRef = collection(db, `users/${userId}/workouts`);
  const q = query(workoutsRef, orderBy("date", "desc"));
  const snap = await getDocs(q);
  
  const workouts: Workout[] = [];
  snap.forEach(d => {
    const w = d.data() as Workout;
    if (w.entries && w.entries.length > 0) {
      workouts.push(w);
    }
  });
  return workouts;
}

export async function deleteWorkout(userId: string, workoutId: string) {
  await deleteDoc(doc(db, `users/${userId}/workouts`, workoutId));
}

export async function updateWorkout(userId: string, workoutId: string, updates: Partial<Workout>) {
  const workoutRef = doc(db, `users/${userId}/workouts`, workoutId);
  await updateDoc(workoutRef, updates);
}

// ==========================================
// MOVEMENTS
// ==========================================

export async function getMovements(userId: string): Promise<Movement[]> {
  const userMovementsRef = collection(db, `users/${userId}/movements`);
  const snap = await getDocs(userMovementsRef);
  
  const movements: Movement[] = [];
  snap.forEach(d => {
    movements.push(d.data() as Movement);
  });
  return movements;
}

export async function saveMovement(userId: string, movement: Movement) {
  await setDoc(doc(db, `users/${userId}/movements`, movement.id), movement);
}

export async function deleteMovement(userId: string, movementId: string) {
  await deleteDoc(doc(db, `users/${userId}/movements`, movementId));
}

// ==========================================
// TEMPLATES
// ==========================================

export async function getTemplates(userId: string): Promise<Template[]> {
  const templatesRef = collection(db, `users/${userId}/templates`);
  const q = query(templatesRef, orderBy("order", "asc"));
  const snap = await getDocs(q);
  
  const templates: Template[] = [];
  snap.forEach(d => {
    templates.push(d.data() as Template);
  });
  return templates;
}

export async function saveTemplate(userId: string, template: Template) {
  await setDoc(doc(db, `users/${userId}/templates`, template.id), template);
}

export async function deleteTemplate(userId: string, templateId: string) {
  await deleteDoc(doc(db, `users/${userId}/templates`, templateId));
}

// ==========================================
// SETTINGS
// ==========================================

export async function getSettings(userId: string): Promise<UserSettings | null> {
  const snap = await getDoc(doc(db, `users/${userId}/settings`, 'current'));
  if (snap.exists()) {
    return snap.data() as UserSettings;
  }
  return null;
}

export async function saveSettings(userId: string, settings: UserSettings) {
  await setDoc(doc(db, `users/${userId}/settings`, 'current'), settings);
}
