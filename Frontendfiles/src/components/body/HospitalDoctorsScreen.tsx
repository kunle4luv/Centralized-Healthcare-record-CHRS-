import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users } from "../ui/icons";

const MOCK_HOSPITALS: Record<string, string> = { h1: "Lagos General", h2: "Abuja Teaching Hospital", h3: "Kano Specialist" };

const MOCK_DOCTORS: Record<string, { id: string; mdcn: string; name: string; role: string; active: boolean }[]> = {
  h1: [
    { id: "d1", mdcn: "MDCN-12345", name: "Dr. Chinedu Okafor", role: "doctor", active: true },
    { id: "d2", mdcn: "MDCN-67890", name: "Dr. Amaka Eze", role: "doctor", active: true },
    { id: "d3", mdcn: "RON-11122", name: "Nurse Bola Adeyemi", role: "nurse", active: false },
  ],
  h2: [{ id: "d4", mdcn: "MDCN-33445", name: "Dr. Ibrahim Yusuf", role: "doctor", active: true }],
  h3: [],
};

export function HospitalDoctorsScreen() {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState(MOCK_DOCTORS[hospitalId || ""] || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ mdcn: "", name: "", role: "doctor" as "doctor" | "nurse" });

  const hospitalName = MOCK_HOSPITALS[hospitalId || ""] || "Hospital";

  useEffect(() => {
    setDoctors(MOCK_DOCTORS[hospitalId || ""] || []);
  }, [hospitalId]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setDoctors((prev) => [
      ...prev,
      { id: "d" + Date.now(), mdcn: form.mdcn, name: form.name, role: form.role, active: true },
    ]);
    setForm({ mdcn: "", name: "", role: "doctor" });
    setShowAddForm(false);
  };

  const handleRevoke = (id: string) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, active: false } : d)));
  };

  const handleReactivate = (id: string) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, active: true } : d)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/hospitals")}
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Hospitals
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{hospitalName} – Doctors & Nurses</h2>
            <p className="text-sm text-slate-500">Register or revoke access to patient records</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-700"
        >
          {showAddForm ? "Cancel" : "+ Register Doctor/Nurse"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Register New Staff</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-500">MDCN / RON Number</label>
              <input
                type="text"
                value={form.mdcn}
                onChange={(e) => setForm((f) => ({ ...f, mdcn: e.target.value }))}
                placeholder="e.g. MDCN-12345 or RON-11122"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Dr. Chinedu Okafor"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "doctor" | "nurse" }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2"
              >
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
              </select>
            </div>
          </div>
          <button type="submit" className="mt-4 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
            Register
          </button>
        </form>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">MDCN / RON</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No doctors or nurses registered. Add one above.
                </td>
              </tr>
            ) : (
              doctors.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{d.name}</td>
                  <td className="px-4 py-3 text-slate-600">{d.mdcn}</td>
                  <td className="px-4 py-3 text-slate-600 capitalize">{d.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        d.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {d.active ? "Active" : "Revoked"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {d.active ? (
                      <button
                        onClick={() => handleRevoke(d.id)}
                        className="text-sm font-semibold text-rose-600 hover:underline"
                      >
                        Revoke Access
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(d.id)}
                        className="text-sm font-semibold text-emerald-600 hover:underline"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <p className="text-sm">
          <strong>Revoking access:</strong> When a doctor or nurse leaves your hospital, revoke their access. They will no
          longer be able to view patient records. If they join another hospital, that hospital must register them.
        </p>
      </div>
    </div>
  );
}
