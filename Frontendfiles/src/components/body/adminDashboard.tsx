import { useNavigate } from "react-router-dom";
import { Hospital } from "../ui/icons";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Total Patients
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900">1.2M</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Connected Hospitals
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900">450</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Records Synced
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900">8.5M</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          System Status
        </p>
        <div className="mt-3 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
          Online
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Hospital Connectivity Status
        </h3>
        <button
          onClick={() => navigate("/dashboard/hospitals")}
          className="text-sm font-semibold text-emerald-600 hover:underline"
        >
          Manage Hospitals →
        </button>
      </div>
      <div className="space-y-3 p-6">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="flex items-center gap-2 font-medium text-slate-800">
            <Hospital className="h-4 w-4 text-slate-400" /> Lagos General
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
            Syncing
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="flex items-center gap-2 font-medium text-slate-800">
            <Hospital className="h-4 w-4 text-slate-400" /> Abuja Teaching Hospital
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
            Syncing
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="flex items-center gap-2 font-medium text-slate-800">
            <Hospital className="h-4 w-4 text-slate-400" /> Kano Specialist
          </span>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase text-rose-700">
            Offline
          </span>
        </div>
      </div>
    </div>
  </div>
  );
};
