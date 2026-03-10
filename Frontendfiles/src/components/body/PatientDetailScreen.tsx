import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Activity, Download, Eye } from "lucide-react";
import { fetchPatientById, type Patient, type RecordType, type Visit } from "../../api/client";
import { useAuth } from "../../context/useAuth";

const RECORD_TABS: { id: RecordType | "all"; label: string }[] = [
  { id: "all", label: "All Records" },
  { id: "diagnosis", label: "Diagnoses" },
  { id: "lab", label: "Lab Results" },
  { id: "prescription", label: "Prescriptions" },
  { id: "imaging", label: "Imaging" },
  { id: "procedure", label: "Procedures" },
];

// Extended timeline for provider view (diagnosis, labs, prescriptions, imaging, procedures)
const MOCK_TIMELINE: (Visit & { recordType: RecordType })[] = [
  {
    id: "t1",
    date: "Jan 28, 2026",
    hospital: "Lagos University Teaching Hospital (LUTH)",
    doctor: "Dr. Amaka Eze",
    diagnosis: "Complete Blood Count (CBC)",
    status: "Completed",
    recordType: "lab",
    labResults: { WBC: "7.2 x 10^9/L", RBC: "5.1 x 10^12/L", Hemoglobin: "14.5 g/dL", Platelets: "245 x 10^9/L" },
  },
  {
    id: "t2",
    date: "Jan 20, 2026",
    hospital: "General Hospital, Ikeja",
    doctor: "Dr. Bola Adeyemi",
    diagnosis: "Upper Respiratory Tract Infection",
    status: "Treated",
    recordType: "prescription",
    prescriptions: [
      { drug: "Amoxicillin 500mg", dosage: "3x daily, 7 days" },
      { drug: "Cetirizine 10mg", dosage: "1x daily, 5 days" },
    ],
  },
  {
    id: "t3",
    date: "Jan 15, 2026",
    hospital: "Reddington Hospital, Victoria Island",
    doctor: "Dr. Ibrahim Yusuf",
    diagnosis: "Chest X-Ray",
    status: "Completed",
    recordType: "imaging",
    imagingFindings: "No acute cardiopulmonary disease. Lung fields are clear. No pleural effusion.",
  },
  {
    id: "t4",
    date: "Dec 10, 2025",
    hospital: "National Hospital, Abuja",
    doctor: "Dr. Ngozi Obi",
    diagnosis: "Hypertension - Initial Diagnosis",
    status: "Ongoing",
    recordType: "diagnosis",
  },
];

export function PatientDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<RecordType | "all">("all");

  useEffect(() => {
    if (!id) return;
    fetchPatientById(id).then(setPatient).finally(() => setLoading(false));
  }, [id]);

  const fullName = patient ? `${patient.firstName} ${patient.lastName}` : "Patient";
  const isProvider = user?.role === "provider" || user?.role === "admin";
  const timeline = MOCK_TIMELINE.filter((t) => activeTab === "all" || t.recordType === activeTab);

  if (loading && !patient) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading patient...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-700">
                {patient?.firstName?.charAt(0)}
                {patient?.lastName?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{fullName}</h2>
              <p className="text-emerald-100">NIN: {patient?.nin || "—"}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/30"
            >
              Back to Dashboard
            </button>
            {isProvider && (
              <button
                onClick={() => navigate(`/dashboard/add-record/${id}`)}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Add Record
              </button>
            )}
          </div>
        </div>
      </div>

      {patient && (
        <>
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard label="Blood Type" value={patient.bloodType || "—"} />
            <InfoCard label="Allergies" value={patient.allergies?.join(", ") || "None"} />
            <InfoCard label="Chronic Conditions" value="Hypertension" />
            <InfoCard label="Last Visit" value="Jan 28, 2026" />
          </div>

          {/* Critical Alerts */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border-2 border-rose-200 bg-rose-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-rose-700 font-bold">Allergies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(patient.allergies || []).map((a) => (
                  <span key={a} className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-800">
                    {a}
                  </span>
                ))}
                {(!patient.allergies || patient.allergies.length === 0) && (
                  <span className="text-rose-600">None recorded</span>
                )}
              </div>
            </div>
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-amber-700" />
                <span className="font-bold text-amber-900">Chronic Conditions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                  Hypertension
                </span>
              </div>
            </div>
          </div>

          {/* Medical Records Tabs */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 pt-4">
              <div className="flex gap-4 overflow-x-auto">
                {RECORD_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
                      activeTab === tab.id
                        ? "border-emerald-600 text-emerald-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Medical History Timeline</h3>
                {isProvider && (
                  <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold">
                    <Download className="h-4 w-4" /> Export Records
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {timeline.map((t) => (
                  <TimelineItem key={t.id} item={t} />
                ))}
              </div>

              {timeline.length === 0 && (
                <div className="py-12 text-center text-slate-500">
                  No records in this category.
                </div>
              )}
            </div>
          </div>

          {/* Add New Record (Provider only) */}
          {isProvider && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Record</h3>
              <p className="text-sm text-slate-600 mb-4">
                Add diagnosis, lab results, prescriptions, imaging, or procedures. Records sync to the central database.
              </p>
              <button
                onClick={() => navigate(`/dashboard/add-record/${id}`)}
                className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 flex items-center justify-center gap-2"
              >
                Create New Medical Entry
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

const TYPE_COLORS: Record<string, string> = {
  diagnosis: "bg-amber-100 text-amber-800",
  lab: "bg-blue-100 text-blue-800",
  prescription: "bg-emerald-100 text-emerald-800",
  imaging: "bg-violet-100 text-violet-800",
  procedure: "bg-rose-100 text-rose-800",
};

function TimelineItem({ item }: { item: Visit & { recordType?: RecordType } }) {
  const type = item.recordType || "diagnosis";
  const color = TYPE_COLORS[type] || "bg-slate-100 text-slate-800";
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{item.date}</p>
          <h4 className="text-sm font-semibold text-slate-900">{item.hospital}</h4>
          <p className="text-xs text-slate-500">Attending: {item.doctor}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${color}`}>
          {type}
        </span>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold text-slate-900 mb-2">{item.diagnosis}</h4>
        {item.labResults && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(item.labResults).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-600">{k}:</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
        )}
        {item.prescriptions && (
          <div className="rounded-lg bg-slate-50 p-3 space-y-2 text-sm">
            {item.prescriptions.map((p, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-slate-700">{p.drug}</span>
                <span className="font-semibold">{p.dosage}</span>
              </div>
            ))}
          </div>
        )}
        {item.imagingFindings && (
          <>
            <p className="text-sm text-slate-700">{item.imagingFindings}</p>
            <button type="button" className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
              <Eye className="h-4 w-4" /> View Image
            </button>
          </>
        )}
        {type === "diagnosis" && !item.labResults && !item.prescriptions && !item.imagingFindings && (
          <p className="text-sm text-slate-600">{item.notes || "No additional notes."}</p>
        )}
      </div>
    </div>
  );
}
