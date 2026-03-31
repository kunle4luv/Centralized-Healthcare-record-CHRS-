/**
 * API client for CMRS backend.
 * Uses mock data when VITE_API_URL is unset or backend is unavailable.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Helper to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem("chrs_token");
};

// Helper for auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export type UserRole = "patient" | "provider" | "admin";

export interface Patient {
  id: string;
  _id?: string;
  nin?: string | null;
  phoneNumber: string;
  email?: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  bloodType?: string;
  allergies?: string[];
  recentVisits?: Visit[];
}

export type RecordType = "diagnosis" | "lab" | "prescription" | "imaging" | "procedure";

export interface Visit {
  id: string;
  date: string;
  hospital: string;
  doctor: string;
  diagnosis: string;
  status: string;
  recordType?: RecordType;
  notes?: string;
  vitals?: { bloodPressure?: string; temperature?: number; heartRate?: number; weight?: number };
  labResults?: Record<string, string>;
  prescriptions?: { drug: string; dosage: string }[];
  imagingFindings?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// --- API functions (with mock fallback) ---

export async function fetchPatient(params: {
  nin?: string;
  phone?: string;
  email?: string;
}): Promise<Patient | null> {
  if (API_BASE) {
    try {
      const search = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v))
      ).toString();
      const res = await fetch(`${API_BASE}/api/patients?${search}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return getMockPatient();
    }
  }
  return getMockPatient();
}

export async function fetchPatientById(id: string): Promise<Patient | null> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/patients/${id}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return getMockPatientById(id);
    }
  }
  return getMockPatientById(id);
}

// Search patient by NIN (returns single patient)
export async function searchPatientByNIN(nin: string): Promise<Patient | null> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/patients/search?nin=${encodeURIComponent(nin)}`, {
        headers: getAuthHeaders()
      });
     
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }
  return getMockPatient();
}

export async function fetchPatients(search?: string): Promise<Patient[]> {
  if (API_BASE) {
    try {
      const url = search ? `${API_BASE}/api/patients?search=${encodeURIComponent(search)}` : `${API_BASE}/api/patients`;
      const res = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!res.ok) return [];
      return res.json();
    } catch {
      return getMockPatientsList();
    }
  }
  return getMockPatientsList();
}

export async function createPatient(data: Partial<Patient>): Promise<Patient | null> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/patients`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return { ...data, id: "mock-" + Date.now() } as Patient;
    }
  }
  return { ...data, id: "mock-" + Date.now() } as Patient;
}

export async function createRecord(patientId: string, record: Partial<Visit>): Promise<Visit | null> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/patients/${patientId}/records`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(record),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return { ...record, id: "r-" + Date.now() } as Visit;
    }
  }
  return { ...record, id: "r-" + Date.now() } as Visit;
}

export async function fetchNotifications(): Promise<Notification[]> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/notifications`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) return [];
      return res.json();
    } catch {
      return getMockNotifications();
    }
  }
  return getMockNotifications();
}

// --- Mock data (fallback when no backend) ---

function getMockPatientById(id: string): Patient | null {
  const list = getMockPatientsList();
  const found = list.find((p) => p.id === id);
  if (found) {
    return { ...found, recentVisits: getMockPatient().recentVisits };
  }
  return getMockPatient();
}

function getMockPatient(): Patient {
  return {
    id: "p1",
    nin: "12345678901",
    phoneNumber: "+2348012345678",
    firstName: "Emmanuel",
    lastName: "Adebayo",
    bloodType: "O+",
    allergies: ["Penicillin"],
    recentVisits: [
      { id: "v1", date: "2024-11-20", hospital: "Lagos University Teaching Hospital", doctor: "Dr. Okon", diagnosis: "Malaria", status: "Treated" },
      { id: "v2", date: "2024-10-15", hospital: "Abuja National Hospital", doctor: "Dr. Musa", diagnosis: "Routine Checkup", status: "Completed" },
    ],
  };
}

function getMockPatientsList(): Patient[] {
  return [
    { id: "p1", nin: "12345678901", phoneNumber: "+2348012345678", firstName: "Emmanuel", lastName: "Adebayo", bloodType: "O+", allergies: ["Penicillin"] },
    { id: "p2", phoneNumber: "+2348098765432", firstName: "Amina", lastName: "Ibrahim", bloodType: "A-", allergies: [] },
    { id: "p3", nin: "98765432109", phoneNumber: "+2348055512345", firstName: "Chukwu", lastName: "Obi", bloodType: "B+", allergies: ["Sulfa"] },
  ];
}

function getMockNotifications(): Notification[] {
  return [
    { id: "n1", title: "Record Accessed", message: "Dr. Okon at LUTH accessed your file on 2024-11-20 at 14:30.", time: "2h ago", read: false },
    { id: "n2", title: "Appointment Reminder", message: "Upcoming visit at Lagos General on 2024-12-01.", time: "1d ago", read: true },
  ];
}
