import { useState } from "react";
import type { FormEvent } from "react";
import { Shield } from "../ui/icons";

type UserRole = "patient" | "provider" | "admin";

type LoginScreenProps = {
  onLogin: (role: UserRole, id: string) => void;
};

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [role, setRole] = useState<UserRole>("patient");
  const [id, setId] = useState("");

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(role, id || "User");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl shadow-soft border border-slate-200 p-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Shield className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900">CMRS Portal</h2>
        <p className="text-center text-slate-500 mt-1">Unified Medical Records Login</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              National ID / Staff ID
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter ID..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Select Role (For Demo)
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="patient">Patient (View My Records)</option>
              <option value="provider">Healthcare Provider (Doctor/Nurse)</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-emerald-600 py-3 font-semibold text-white shadow-md shadow-emerald-200/60 transition hover:bg-emerald-700"
          >
            Access Dashboard
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Secure connection - 256-bit encryption
        </div>
      </div>
    </div>
  );
};
