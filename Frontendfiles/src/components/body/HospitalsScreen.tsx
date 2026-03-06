import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hospital } from "../ui/icons";

const MOCK_HOSPITALS = [
  { id: "h1", name: "Lagos General", type: "government", state: "Lagos", status: "syncing" },
  { id: "h2", name: "Abuja Teaching Hospital", type: "government", state: "FCT", status: "syncing" },
  { id: "h3", name: "Kano Specialist", type: "private", state: "Kano", status: "offline" },
];

export function HospitalsScreen() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState(MOCK_HOSPITALS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "government" as "government" | "private", state: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setHospitals((prev) => [
      ...prev,
      { id: "h" + Date.now(), name: form.name, type: form.type, state: form.state, status: "syncing" },
    ]);
    setForm({ name: "", type: "government", state: "" });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Hospital className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Registered Hospitals</h2>
            <p className="text-sm text-slate-500">Manage healthcare facilities on CMRS</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-700"
        >
          {showAddForm ? "Cancel" : "+ Register Hospital"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Register New Hospital</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-500">Hospital Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. General Hospital, Ikeja"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "government" | "private" }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2"
              >
                <option value="government">Government</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                placeholder="e.g. Lagos"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2"
                required
              />
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
              <th className="px-4 py-3">Hospital</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {hospitals.map((h) => (
              <tr key={h.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                  <Hospital className="h-4 w-4 text-slate-400" /> {h.name}
                </td>
                <td className="px-4 py-3 text-slate-600 capitalize">{h.type}</td>
                <td className="px-4 py-3 text-slate-600">{h.state}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                      h.status === "syncing" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {h.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => navigate(`/dashboard/hospitals/${h.id}/doctors`)}
                    className="text-sm font-semibold text-emerald-700 hover:underline"
                  >
                    Manage Doctors
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
