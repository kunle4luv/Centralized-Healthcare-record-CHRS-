import { useNavigate } from "react-router-dom";
import { Database, Shield } from "../ui/icons";

const MOCK_PATIENT_DATA = {
  name: "Emmanuel Adebayo",
  bloodType: "O+",
  allergies: "Penicillin",
  ninStatus: "Verified",
};

export const PatientDashboard = () => {
  const navigate = useNavigate();
  return (
  <div className="space-y-6" >
    {/* Patient Access Notice */}
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 flex items-start gap-3">
      <Shield className="h-6 w-6 shrink-0 text-blue-700" />
      <div>
        <h3 className="font-semibold text-blue-900">Your records are protected</h3>
        <p className="text-sm text-blue-800 mt-1">
          You cannot access your full medical records directly. Request access through your hospital or doctor—they will
          approve and grant access. <button onClick={() => navigate("/dashboard/request-access")} className="font-semibold underline hover:text-blue-600">Request access →</button>
        </p>
      </div>
    </div>

    {/* Quick Info (visible without full access) */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-700">Blood Type</p>
        <p className="mt-2 text-2xl font-bold text-blue-900">{MOCK_PATIENT_DATA.bloodType}</p>
      </div>
      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-rose-700">Allergies</p>
        <p className="mt-2 text-2xl font-bold text-rose-900">{MOCK_PATIENT_DATA.allergies}</p>
      </div>
      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-700">NIN Status</p>
        <p className="mt-2 text-2xl font-bold text-violet-900">{MOCK_PATIENT_DATA.ninStatus}</p>
      </div>
    </div>

    {/* Request Access CTA */}
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
      <h3 className="font-semibold text-emerald-900">Need your full medical history?</h3>
      <p className="text-sm text-emerald-800 mt-2">
        Request access via your hospital or doctor. Once approved, you can view your unified history and download reports.
      </p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => navigate("/dashboard/request-access")}
          className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Request Access
        </button>
        <button
          onClick={() => navigate("/dashboard/download-report")}
          className="rounded-2xl border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
        >
          Download Report (after approval)
        </button>
      </div>
    </div>

    {/* Placeholder: Full history only after approval */}
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-600" /> Unified Medical History
        </h3>
      </div>
      <div className="p-8 text-center text-slate-500">
        <p>Request access via your hospital or doctor to view your full medical history here.</p>
        <button onClick={() => navigate("/dashboard/request-access")} className="mt-3 text-emerald-600 font-semibold hover:underline">Request access →</button>
      </div>
      </div>

    {/* Access Log (Security Feature) */}
    <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900">
      <Shield className="mt-1 h-5 w-5 text-amber-700" />
      <div>
        <h4 className="text-sm font-semibold">Data Access Alert</h4>
        <p className="text-sm text-amber-800">
          Dr. Okon at LUTH accessed your file on 2024-11-20 at 14:30.
          <span className="ml-2 font-semibold underline">
            Report if unrecognized.
          </span>
        </p>
      </div>
    </div>
  </div>
  );
};
