"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { Download, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { getWorkouts } from "../../lib/firestore";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { settings, updateSettings } = useSettings();

  const handleExport = async () => {
    if (!user) return;
    const workouts = await getWorkouts(user.uid);
    let csv = "Date,Movement,Weight,Unit,Reps,Notes\n";
    workouts.forEach((w) => {
      w.entries.forEach((e) => {
        csv += `${w.date},"${e.movementName}",${e.weight},${e.unit},${e.reps},"${e.notes || ''}"\n`;
      });
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gym-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full pt-6">
      <h1 className="text-2xl font-black tracking-tight mb-2">Settings</h1>

      {/* Profile */}
      <section className="card-depth p-4 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-text-tertiary uppercase tracking-wider">Account</h2>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{user?.email}</div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-danger font-semibold bg-danger/10 px-3 py-2 rounded-lg active:scale-95"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </section>

      {/* Appearance */}
      <section className="card-depth p-4 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-text-tertiary uppercase tracking-wider">Appearance</h2>
        <div className="grid grid-cols-3 gap-2 bg-bg-tertiary p-1 rounded-xl">
          {[
            { id: "system", icon: Monitor, label: "System" },
            { id: "light", icon: Sun, label: "Light" },
            { id: "dark", icon: Moon, label: "Dark" },
          ].map((theme) => {
            const isActive = settings.theme === theme.id;
            const Icon = theme.icon;
            return (
              <button
                key={theme.id}
                onClick={() => updateSettings({ theme: theme.id as any })}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-bg-secondary text-accent shadow-sm" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon size={18} />
                {theme.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Weight Unit */}
      <section className="card-depth p-4 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-text-tertiary uppercase tracking-wider">Weight Unit</h2>
        <div className="grid grid-cols-2 gap-2 bg-bg-tertiary p-1 rounded-xl">
          {["kg", "lbs"].map((unit) => {
            const isActive = settings.unit === unit;
            return (
              <button
                key={unit}
                onClick={() => updateSettings({ unit: unit as any })}
                className={`flex justify-center py-2 rounded-lg text-sm font-medium uppercase tracking-wider transition-colors ${
                  isActive ? "bg-bg-secondary text-accent shadow-sm" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {unit}
              </button>
            )
          })}
        </div>
      </section>

      {/* Data */}
      <section className="card-depth p-4 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-text-tertiary uppercase tracking-wider">Data</h2>
        <button 
          onClick={handleExport}
          className="w-full flex justify-center items-center gap-2 bg-bg-secondary border border-border py-3 rounded-xl font-semibold hover:bg-bg-tertiary active:scale-95 transition-transform"
        >
          <Download size={18} />
          Export Data as CSV
        </button>
      </section>

      <div className="text-center mt-8 text-xs text-text-tertiary">
        Gym Logger • Built with Next.js & Firebase
      </div>
    </div>
  );
}
