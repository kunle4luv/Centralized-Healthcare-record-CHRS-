import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PlusCircle, Shield, Activity } from "../ui/icons";
import { createPatient, searchPatientByNIN, type Patient } from "../../api/client";

interface HospitalDashboardProps {
  hospitalName: string;
  primaryColor: string;
  accentColor: string;
  bgGradient: string;
  buttonGradient: string;
}

// Hospital A Dashboard - Teal/Cyan Theme
export function HospitalADashboard() {
  return (
    <HospitalDashboardWrapper
      hospitalName="City General Hospital"
      primaryColor="teal"
      accentColor="emerald"
      bgGradient="from-teal-600 to-cyan-600"
      buttonGradient="from-teal-600 to-teal-700"
    />
  );
}

// Hospital B Dashboard - Indigo/Purple Theme
export function HospitalBDashboard() {
  return (
    <HospitalDashboardWrapper
      hospitalName="Metropolitan Medical Center"
      primaryColor="indigo"
      accentColor="violet"
      bgGradient="from-indigo-600 to-purple-600"
      buttonGradient="from-indigo-600 to-indigo-700"
    />
  );
}

function HospitalDashboardWrapper({ 
  hospitalName, 
  primaryColor, 
  accentColor,
  bgGradient,
  buttonGradient
}: HospitalDashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"search" | "register">("search");
  const [searchNIN, setSearchNIN] = useState("");
  const [searchResult, setSearchResult] = useState<Patient | null>(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  
  // Registration form state
  const [formData, setFormData] = useState({
    nin: "",
    phoneNumber: "",
    email: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    bloodType: "",
    allergies: ""
  });
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registering, setRegistering] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNIN.trim()) return;
    
    setSearching(true);
    setSearchError("");
    setSearchResult(null);
    
    try {
      const result = await searchPatientByNIN(searchNIN.trim());
      if (result) {
        setSearchResult(result);
      } else {
        setSearchError("No patient found with this NIN. Please register the patient first.");
      }
    } catch {
      setSearchError("Error searching for patient. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess(false);
    setRegistering(true);

    try {
      const allergiesArray = formData.allergies
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a);

      const patientData = {
        nin: formData.nin || undefined,
        phoneNumber: formData.phoneNumber,
        email: formData.email || undefined,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth || undefined,
        bloodType: formData.bloodType || undefined,
        allergies: allergiesArray,
      };

      const result = await createPatient(patientData);
      if (result) {
        setRegisterSuccess(true);
        setFormData({
          nin: "",
          phoneNumber: "",
          email: "",
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          bloodType: "",
          allergies: ""
        });
      } else {
        setRegisterError("Failed to create patient. Please try again.");
      }
    } catch {
      setRegisterError("Error creating patient. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className={`bg-gradient-to-r ${bgGradient} text-white shadow-lg`}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{hospitalName}</h1>
              <p className="text-white/80 text-sm mt-1">Centralized Healthcare Record System</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-sm">
                <span className="text-white/80">System Status:</span>{" "}
                <span className="font-semibold flex items-center gap-1">
                  <Activity className="h-4 w-4" /> Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl bg-${accentColor}-100 flex items-center justify-center`}>
                <Search className={`h-6 w-6 text-${accentColor}-600`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Search Patients</p>
                <p className="text-2xl font-bold text-slate-900">By NIN</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Medical Records</p>
                <p className="text-2xl font-bold text-slate-900">Centralized</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Activity className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Access</p>
                <p className="text-2xl font-bold text-slate-900">24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              activeTab === "search"
                ? `bg-gradient-to-r ${buttonGradient} text-white shadow-lg shadow-${primaryColor}/30`
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" /> Search Patient
            </span>
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              activeTab === "register"
                ? `bg-gradient-to-r ${buttonGradient} text-white shadow-lg shadow-${primaryColor}/30`
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Register Patient
            </span>
          </button>
        </div>

        {/* Search Panel */}
        {activeTab === "search" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Search Patient by NIN</h2>
              <p className="text-sm text-slate-500 mt-1">Enter the patient's National Identification Number to retrieve their records</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchNIN}
                    onChange={(e) => setSearchNIN(e.target.value)}
                    placeholder="Enter National Identification Number (NIN)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searching || !searchNIN.trim()}
                  className={`px-8 bg-gradient-to-r ${buttonGradient} text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {searching ? "Searching..." : "Search"}
                </button>
              </form>

              {/* Search Error */}
              {searchError && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                  <div className="h-5 w-5 text-rose-500 mt-0.5">⚠️</div>
                  <div>
                    <p className="text-rose-700 font-medium">Patient Not Found</p>
                    <p className="text-rose-600 text-sm">{searchError}</p>
                  </div>
                </div>
              )}

              {/* Search Result */}
              {searchResult && (
                <div className="mt-6 p-6 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-16 w-16 rounded-full bg-${accentColor}-100 flex items-center justify-center text-2xl font-bold text-${accentColor}-600`}>
                        {searchResult.firstName?.charAt(0)}{searchResult.lastName?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{searchResult.firstName} {searchResult.lastName}</h3>
                        <p className="text-slate-500">NIN: {searchResult.nin || "Not provided"}</p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-sm text-slate-500">📞 {searchResult.phoneNumber}</span>
                          {searchResult.email && <span className="text-sm text-slate-500">✉️ {searchResult.email}</span>}
                          {searchResult.bloodType && <span className="text-sm text-slate-500">🩸 {searchResult.bloodType}</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/dashboard/patient/${searchResult._id || searchResult.id}`)}
                      className={`px-6 py-2 bg-gradient-to-r ${buttonGradient} text-white rounded-xl font-medium transition`}
                    >
                      View Full Record
                    </button>
                  </div>
                  
                  {/* Recent Visits */}
                  {searchResult.recentVisits && searchResult.recentVisits.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Recent Visits</h4>
                      <div className="space-y-3">
                        {searchResult.recentVisits.slice(0, 3).map((visit) => (
                          <div key={visit.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100">
                            <div>
                              <p className="font-medium text-slate-900">{visit.diagnosis}</p>
                              <p className="text-sm text-slate-500">{visit.hospital} • {visit.doctor}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                visit.status === "Completed" || visit.status === "Treated"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}>
                                {visit.status}
                              </span>
                              <p className="text-xs text-slate-400 mt-1">{visit.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Register Panel */}
        {activeTab === "register" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Register New Patient</h2>
              <p className="text-sm text-slate-500 mt-1">Add a new patient to the centralized healthcare system</p>
            </div>
            <div className="p-6">
              {registerSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <div className="h-5 w-5 text-emerald-500 mt-0.5">✓</div>
                  <div>
                    <p className="text-emerald-700 font-medium">Patient Registered Successfully</p>
                    <p className="text-emerald-600 text-sm">The patient has been added to the centralized database.</p>
                  </div>
                </div>
              )}

              {registerError && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                  <div className="h-5 w-5 text-rose-500 mt-0.5">⚠️</div>
                  <div>
                    <p className="text-rose-700 font-medium">Registration Failed</p>
                    <p className="text-rose-600 text-sm">{registerError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+2348012345678"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">National ID (NIN)</label>
                  <input
                    type="text"
                    value={formData.nin}
                    onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                    placeholder="11-digit NIN"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patient@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Blood Type</label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition"
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Allergies</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="Penicillin, Sulfa (comma-separated)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={registering}
                    className={`w-full px-8 py-4 bg-gradient-to-r ${buttonGradient} text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {registering ? "Registering..." : "Register Patient"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">About This Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Centralized Access</h4>
              <p className="text-sm text-slate-500">
                This dashboard provides access to the centralized healthcare record system. 
                You can search for patients by their National Identification Number (NIN) 
                and view their complete medical history from any participating hospital.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Data Synchronization</h4>
              <p className="text-sm text-slate-500">
                All patient records are stored in a centralized database. Records added from 
                this hospital will be visible to all other participating healthcare providers 
                in the network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalDashboardWrapper;
