import { Database, Shield } from "../ui/icons";

const MOCK_PATIENT_DATA = {
  name: "Emmanuel Adebayo",
  nin: "12345678901",
  bloodType: "O+",
  allergies: "Penicillin",
  recentVisits: [
    { date: "2024-11-20", hospital: "Lagos University Teaching Hospital", doctor: "Dr. Okon", diagnosis: "Malaria", status: "Treated" },
    { date: "2024-10-15", hospital: "Abuja National Hospital", doctor: "Dr. Musa", diagnosis: "Routine Checkup", status: "Completed" }
  ]
};

export const PatientDashboard = () => (
  <div className="space-y-6">
    {/* Vitals Cards */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-700">
          Blood Type
        </p>
        <p className="mt-2 text-2xl font-bold text-blue-900">
          {MOCK_PATIENT_DATA.bloodType}
        </p>
      </div>
      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-rose-700">
          Allergies
        </p>
        <p className="mt-2 text-2xl font-bold text-rose-900">
          {MOCK_PATIENT_DATA.allergies}
        </p>
      </div>
      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-700">
          NIN Status
        </p>
        <p className="mt-2 text-2xl font-bold text-violet-900">Verified</p>
      </div>
    </div>

    {/* Unified History Section */}
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-600" /> Unified Medical
          History
        </h3>
        <button className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold uppercase text-emerald-700 hover:bg-emerald-50">
          Download Report
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Hospital (Location)</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Diagnosis</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_PATIENT_DATA.recentVisits.map((visit, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-600">{visit.date}</td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {visit.hospital}
                </td>
                <td className="px-4 py-3 text-slate-600">{visit.doctor}</td>
                <td className="px-4 py-3 text-slate-700">{visit.diagnosis}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
                    {visit.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Access Log (Security Feature) */}
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900">
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
