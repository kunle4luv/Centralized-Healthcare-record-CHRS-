import { useState } from "react";
import { LoginScreen } from "../auth/login";
import { AdminDashboard } from "./adminDashboard";
import { PatientDashboard } from "./patientDashboard";
import { ProviderDashboard } from "./provider";
import {
  Activity,
  Bell,
  LogOut,
  Settings,
  Shield,
  User,
  Users,
} from "../ui/icons";

type DashboardDemoProps = {
  onBackHome?: () => void;
};

export default function DashboardDemo({ onBackHome }: DashboardDemoProps) {
  type UserRole = "patient" | "provider" | "admin";
  type User = { role: UserRole; name: string };

  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: UserRole, name: string) => {
    setUser({ role, name });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} onBackHome={onBackHome} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-slate-100">
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-sm font-bold tracking-[0.2em] text-emerald-200">
            CMRS
          </span>
        </div>

        <nav className="px-4 space-y-2">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            <Activity className="h-4 w-4" /> Dashboard
          </div>
          <div className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
            <User className="h-4 w-4" /> Profile
          </div>
          {user.role !== "patient" && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
              <Users className="h-4 w-4" /> Patients
            </div>
          )}
          <div className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
            <Settings className="h-4 w-4" /> Settings
          </div>
        </nav>

        <div className="mt-auto p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-6">
          <h2 className="text-lg font-bold text-slate-900 capitalize">
            {user.role} Dashboard
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-10 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-500">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right text-xs uppercase tracking-wide text-slate-500 hidden sm:block">
                <div className="text-[11px] text-slate-400">Welcome</div>
                <div className="text-sm font-semibold text-slate-900 normal-case">
                  {user.name}
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center border border-emerald-200">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {user.role === "patient" && <PatientDashboard />}
          {user.role === "provider" && <ProviderDashboard />}
          {user.role === "admin" && <AdminDashboard />}
        </main>
      </div>
    </div>
  );
}
