"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getMovements, deleteMovement, saveMovement } from "../../lib/firestore";
import { Movement, MovementCategory } from "../../types";
import { SkeletonList } from "../../components/Skeleton";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";

const CATEGORIES: MovementCategory[] = ["Legs", "Back", "Chest", "Shoulders", "Arms", "Core", "Cardio", "Other"];

export default function MovementsPage() {
  const { user } = useAuth();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<MovementCategory | "All">("All");

  useEffect(() => {
    if (!user) return;
    getMovements(user.uid).then((m) => {
      setMovements(m.sort((a,b) => a.name.localeCompare(b.name)));
      setLoading(false);
    });
  }, [user]);

  const filtered = useMemo(() => {
    return movements.filter(m => {
      const matchCat = filterCat === "All" || m.category === filterCat;
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [movements, search, filterCat]);

  const handleDelete = async (m: Movement) => {
    if (!user) return;
    setMovements(prev => prev.filter(x => x.id !== m.id));
    await deleteMovement(user.uid, m.id);
  };

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState<MovementCategory>("Other");

  const handleAdd = async () => {
    if (!user || !newTitle.trim()) return;
    const id = Date.now().toString() + "-" + newTitle.trim().toLowerCase().replace(/\s+/g, '-');
    const newM: Movement = {
      id,
      name: newTitle.trim(),
      category: newCat,
      isCustom: true
    };
    setMovements(prev => [...prev, newM].sort((a,b) => a.name.localeCompare(b.name)));
    await saveMovement(user.uid, newM);
    setShowAdd(false);
    setNewTitle("");
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full pt-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-black tracking-tight">Movements</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 bg-accent/10 text-accent px-3 py-1.5 rounded-full font-semibold text-sm active:scale-95"
        >
          <Plus size={16} /> Add Custom
        </button>
      </div>

      {showAdd && (
        <div className="card-depth p-4 animate-slide-up mb-2 flex flex-col gap-3 border-accent/50">
          <div className="flex justify-between items-center">
            <h2 className="font-bold">Add Movement</h2>
            <button onClick={() => setShowAdd(false)} className="text-text-tertiary"><X size={20}/></button>
          </div>
          <input 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            placeholder="Movement name" 
            className="w-full bg-bg-tertiary p-3 rounded-lg outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="flex gap-2">
            <select 
              value={newCat} 
              onChange={(e) => setNewCat(e.target.value as MovementCategory)}
              className="bg-bg-tertiary p-3 rounded-lg outline-none flex-1"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={handleAdd} className="bg-accent text-white px-4 rounded-lg font-bold">Save</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-text-tertiary" size={20} />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movements..." 
          className="w-full bg-bg-tertiary pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium placeholder:text-text-tertiary"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {["All", ...CATEGORIES].map(c => (
          <button
            key={c}
            onClick={() => setFilterCat(c as any)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors flex-shrink-0 ${
              filterCat === c 
                ? "bg-text-primary text-bg-primary" 
                : "bg-bg-secondary text-text-secondary border border-border"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 mt-2">
        {loading ? <SkeletonList count={6} /> : (
          filtered.map(m => (
            <div key={m.id} className="flex justify-between items-center p-4 bg-bg-secondary rounded-xl border border-border">
              <div className="flex flex-col">
                <span className="font-semibold text-text-primary">{m.name}</span>
                <span className="text-xs text-text-tertiary uppercase tracking-wider">{m.category}</span>
              </div>
              
              <button 
                onClick={() => handleDelete(m)} 
                className="p-2 text-text-tertiary hover:text-danger active:scale-90"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-10 text-text-tertiary">No movements found.</div>
        )}
      </div>
    </div>
  );
}
