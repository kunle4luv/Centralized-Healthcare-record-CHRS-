import { useState } from "react";
import type { FormEvent, ReactNode, JSX } from "react";
import {
  Activity,
  AlertCircle,
  Bell,
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  LogOut,
  Plus,
  Search,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";

type SectionId = "overview" | "patients" | "appointments" | "settings" | "patient-detail";
type RecordTab =
  | "all"
  | "diagnoses"
  | "labs"
  | "prescriptions"
  | "imaging"
  | "procedures";

type Patient = {
  nin: string;
  name: string;
  dob: string;
  age: number;
  gender: string;
  bloodType: string;
  phone: string;
  address: string;
  allergies: string[];
  chronicConditions: string[];
  lastVisit: string;
};

type ProviderDashboardProps = {
  onLogout?: () => void;
};

// --- PROVIDER DASHBOARD ---
export function ProviderDashboard({ onLogout }: ProviderDashboardProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [searchNIN, setSearchNIN] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeRecordTab, setActiveRecordTab] = useState<RecordTab>("all");

  const handlePatientSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanedNIN = searchNIN.trim();
    // Simulate NIN verification and patient lookup
    setSelectedPatient({
      nin: cleanedNIN,
      name: "Emmanuel Adebayo",
      dob: "March 15, 1985",
      age: 41,
      gender: "Male",
      bloodType: "O+",
      phone: "+234 803 xxx 4567",
      address: "Ikeja, Lagos",
      allergies: ["Penicillin", "Peanuts"],
      chronicConditions: ["Hypertension"],
      lastVisit: "Jan 28, 2026 - LUTH",
    });
    setActiveSection("patient-detail");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-green-700" />
            <span className="font-bold text-xl text-gray-900">Provider Portal</span>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
            <span className="text-sm text-gray-600 hidden md:block">
              Welcome, <strong>Dr. Chinedu Okafor</strong>
            </span>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium"
              >
                <LogOut size={18} /> <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-2 sticky top-24">
            <NavButton
              id="overview"
              label="Dashboard"
              icon={Activity}
              active={activeSection}
              onClick={setActiveSection}
            />
            <NavButton
              id="patients"
              label="Patient Lookup"
              icon={Search}
              active={activeSection}
              onClick={setActiveSection}
            />
            <NavButton
              id="appointments"
              label="My Appointments"
              icon={Calendar}
              active={activeSection}
              onClick={setActiveSection}
            />
            <NavButton
              id="settings"
              label="Settings"
              icon={Settings}
              active={activeSection}
              onClick={setActiveSection}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeSection === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  icon={<Users className="text-blue-600" />}
                  title="Patients Today"
                  value="8"
                  subtitle="3 pending consultations"
                />
                <StatCard
                  icon={<FileText className="text-green-600" />}
                  title="Records Accessed"
                  value="24"
                  subtitle="This week"
                />
                <StatCard
                  icon={<Clock className="text-purple-600" />}
                  title="Next Appointment"
                  value="2:00 PM"
                  subtitle="Mrs. Afolabi (Follow-up)"
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Today's Appointments
                </h3>
                <div className="space-y-3">
                  <TodayAppointment
                    time="2:00 PM"
                    name="Mrs. Afolabi"
                    type="Follow-up"
                    status="Pending"
                  />
                  <TodayAppointment
                    time="3:30 PM"
                    name="Mr. Chukwu"
                    type="New Consultation"
                    status="Confirmed"
                  />
                  <TodayAppointment
                    time="4:45 PM"
                    name="Miss Okonkwo"
                    type="Lab Review"
                    status="Confirmed"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "patients" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Patient Record Lookup
                </h3>
                <p className="text-gray-600 mb-6">
                  Search for a patient using their National Identity Number (NIN)
                  to access their complete medical history across all Nigerian
                  healthcare facilities.
                </p>

                <form onSubmit={handlePatientSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={searchNIN}
                      onChange={(e) => setSearchNIN(e.target.value)}
                      placeholder="Enter Patient NIN (11 digits)"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                      maxLength={11}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition flex items-center justify-center gap-2"
                  >
                    <Shield size={20} /> Verify & Access Records
                  </button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">NDPA Compliance Notice</p>
                      <p>
                        All patient record access is logged and audited. Ensure you
                        have patient consent before accessing records.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="font-bold text-gray-900 mb-4">Recent Patient Searches</h4>
                <div className="space-y-2">
                  <RecentSearch
                    name="Emmanuel Adebayo"
                    nin="123****8901"
                    time="2 hours ago"
                  />
                  <RecentSearch
                    name="Fatima Ibrahim"
                    nin="456****2345"
                    time="5 hours ago"
                  />
                  <RecentSearch
                    name="Chidi Okeke"
                    nin="789****6789"
                    time="Yesterday"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "patient-detail" && selectedPatient && (
            <div className="space-y-6">
              {/* Patient Info Header */}
              <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-green-700" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                      <p className="text-green-100">NIN: {selectedPatient.nin}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection("patients")}
                    className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition self-start"
                  >
                    Back to Search
                  </button>
                </div>
              </div>

              {/* Patient Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoCard label="Age" value={`${selectedPatient.age} years`} />
                <InfoCard label="Gender" value={selectedPatient.gender} />
                <InfoCard label="Blood Type" value={selectedPatient.bloodType} />
                <InfoCard
                  label="Last Visit"
                  value={selectedPatient.lastVisit.split(" - ")[0]}
                />
              </div>

              {/* Critical Alerts */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-700" />
                    <h4 className="font-bold text-red-900">Allergies</h4>
                  </div>
                  <div className="flex gap-2">
                    {selectedPatient.allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-orange-700" />
                    <h4 className="font-bold text-orange-900">Chronic Conditions</h4>
                  </div>
                  <div className="flex gap-2">
                    {selectedPatient.chronicConditions.map((condition) => (
                      <span
                        key={condition}
                        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Medical Records Tabs */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="border-b border-gray-200 px-6 pt-4">
                  <div className="flex gap-4 overflow-x-auto">
                    <TabButton
                      label="All Records"
                      id="all"
                      active={activeRecordTab}
                      onClick={setActiveRecordTab}
                    />
                    <TabButton
                      label="Diagnoses"
                      id="diagnoses"
                      active={activeRecordTab}
                      onClick={setActiveRecordTab}
                    />
                    <TabButton
                      label="Lab Results"
                      id="labs"
                      active={activeRecordTab}
                      onClick={setActiveRecordTab}
                    />
                    <TabButton
                      label="Prescriptions"
                      id="prescriptions"
                      active={activeRecordTab}
                      onClick={setActiveRecordTab}
                    />
                    <TabButton
                      label="Imaging"
                      id="imaging"
                      active={activeRecordTab}
                      onClick={setActiveRecordTab}
                    />
                    <TabButton
                      label="Procedures"
                      id="procedures"
                      active={activeRecordTab}
                      onClick={setActiveRecordTab}
                    />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">
                      Medical History Timeline
                    </h3>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
                    >
                      <Download size={18} /> Export Records
                    </button>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-6">
                    <TimelineItem
                      date="Jan 28, 2026"
                      hospital="Lagos University Teaching Hospital (LUTH)"
                      doctor="Dr. Amaka Eze"
                      type="Lab Results"
                      color="blue"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Complete Blood Count (CBC)
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">WBC:</span>
                          <span className="font-semibold">7.2 x 10^9/L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">RBC:</span>
                          <span className="font-semibold">5.1 x 10^12/L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hemoglobin:</span>
                          <span className="font-semibold">14.5 g/dL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Platelets:</span>
                          <span className="font-semibold">245 x 10^9/L</span>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-green-700 font-semibold">
                        All values within normal range
                      </p>
                    </TimelineItem>

                    <TimelineItem
                      date="Jan 20, 2026"
                      hospital="General Hospital, Ikeja"
                      doctor="Dr. Bola Adeyemi"
                      type="Prescription"
                      color="green"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Upper Respiratory Tract Infection
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Amoxicillin 500mg</span>
                          <span className="font-semibold">3x daily, 7 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Cetirizine 10mg</span>
                          <span className="font-semibold">1x daily, 5 days</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Diagnosis: Acute Bronchitis
                      </p>
                    </TimelineItem>

                    <TimelineItem
                      date="Jan 15, 2026"
                      hospital="Reddington Hospital, Victoria Island"
                      doctor="Dr. Ibrahim Yusuf"
                      type="Imaging"
                      color="purple"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">Chest X-Ray</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Indication: Persistent cough for 3 weeks
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Findings:</strong> No acute cardiopulmonary disease.
                        Lung fields are clear. No pleural effusion.
                      </p>
                      <button
                        type="button"
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                      >
                        <Eye size={16} /> View Image
                      </button>
                    </TimelineItem>

                    <TimelineItem
                      date="Dec 10, 2025"
                      hospital="National Hospital, Abuja"
                      doctor="Dr. Ngozi Obi"
                      type="Diagnosis"
                      color="orange"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Hypertension - Initial Diagnosis
                      </h4>
                      <div className="text-sm space-y-1">
                        <p className="text-gray-700">
                          BP: 145/95 mmHg (confirmed over 3 visits)
                        </p>
                        <p className="text-gray-700">
                          Treatment: Lifestyle modification + Amlodipine 5mg daily
                        </p>
                        <p className="text-gray-700">
                          Follow-up: Scheduled for 3 months
                        </p>
                      </div>
                    </TimelineItem>
                  </div>
                </div>
              </div>

              {/* Add New Record */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Add New Record
                </h3>
                <button
                  type="button"
                  className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Create New Medical Entry
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

type NavButtonProps = {
  id: SectionId;
  label: string;
  icon: (props: { className?: string }) => JSX.Element;
  active: SectionId;
  onClick: (id: SectionId) => void;
};

function NavButton({ id, label, icon: Icon, active, onClick }: NavButtonProps) {
  const isActive = active === id;
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        isActive
          ? "bg-green-700 text-white shadow-sm"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle: string;
};

function StatCard({ icon, title, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-2">{icon}</div>
      </div>
    </div>
  );
}

type TodayAppointmentProps = {
  time: string;
  name: string;
  type: string;
  status: "Pending" | "Confirmed";
};

function TodayAppointment({ time, name, type, status }: TodayAppointmentProps) {
  const statusStyles =
    status === "Confirmed"
      ? "bg-green-100 text-green-800"
      : "bg-amber-100 text-amber-800";

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
      <div>
        <p className="text-sm font-semibold text-gray-900">
          {time} - {name}
        </p>
        <p className="text-xs text-gray-500">{type}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}>
        {status}
      </span>
    </div>
  );
}

type RecentSearchProps = {
  name: string;
  nin: string;
  time: string;
};

function RecentSearch({ name, nin, time }: RecentSearchProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
      <div>
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">NIN: {nin}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

type TabButtonProps = {
  label: string;
  id: RecordTab;
  active: RecordTab;
  onClick: (id: RecordTab) => void;
};

function TabButton({ label, id, active, onClick }: TabButtonProps) {
  const isActive = active === id;
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
        isActive
          ? "border-green-700 text-green-700"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

type TimelineItemProps = {
  date: string;
  hospital: string;
  doctor: string;
  type: string;
  color: "blue" | "green" | "purple" | "orange";
  children: ReactNode;
};

function TimelineItem({
  date,
  hospital,
  doctor,
  type,
  color,
  children,
}: TimelineItemProps) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
    orange: "bg-orange-100 text-orange-800",
  } as const;

  return (
    <div className="rounded-lg border border-gray-100 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">{date}</p>
          <h4 className="text-sm font-semibold text-gray-900">{hospital}</h4>
          <p className="text-xs text-gray-500">Attending: {doctor}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colorMap[color]}`}>
          {type}
        </span>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default ProviderDashboard;
