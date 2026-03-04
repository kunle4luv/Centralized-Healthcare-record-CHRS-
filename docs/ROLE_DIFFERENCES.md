# CMRS Role Differences: Patient, Provider, and Admin

## Overview

The Centralized Medical Records System (CMRS) has three user roles. Each role has different access levels to protect patient privacy and ensure proper clinical workflow.

---

## 1. Patient

### Who
Individuals receiving healthcare. Patients are identified by NIN (primary) or phone number (secondary).

### What they can do
- **View basic info**: Blood type, allergies, NIN status (limited self-service)
- **Request access**: Request their full medical records through their hospital or doctor
- **Download report**: After approval, download their unified medical history
- **View approved records**: Once a doctor approves their request, they can see their records

### What they cannot do
- **Cannot search by NIN**: Patients do not have direct access to search or pull their records by NIN
- **Cannot access full history**: Full medical history is only visible after doctor approval
- **No doctor/hospital management**: Cannot register hospitals or doctors

### Access flow
1. Patient visits a hospital or contacts their doctor
2. Patient (or doctor on their behalf) submits a "Request Access"
3. Hospital/doctor verifies identity and approves the request
4. Patient can then view and download their records

---

## 2. Provider (Doctor / Nurse)

### Who
Healthcare professionals (doctors with MDCN, nurses with RON) registered under a CMRS-approved hospital.

### What they can do
- **Search patients**: Search by NIN, phone, or name (when patient is present/consented)
- **View full records**: Access complete medical history, diagnoses, labs, prescriptions, imaging, procedures
- **Add records**: Create new entries (diagnosis, lab results, prescriptions, imaging, procedures, checkups)
- **Push to central DB**: Records sync to the unified CMRS database

### What they cannot do
- **Must be registered**: Only doctors/nurses registered by their hospital can access patient records
- **Revoked when leaving**: If they leave a hospital, their access is revoked; the new hospital must register them
- **Cannot register hospitals**: That is an Admin function
- **Cannot register other doctors**: Hospital Admin manages doctor registration

### Access flow
1. Hospital is registered on CMRS (by Admin)
2. Hospital Admin registers the doctor/nurse (MDCN/RON)
3. Provider logs in and can search/access patient records
4. When provider leaves, Admin revokes their access

---

## 3. Admin

### Who
System administrators and hospital administrators who manage CMRS.

### What they can do
- **Register hospitals**: Add new healthcare facilities (government or private)
- **Manage doctors**: Per hospital, register doctors (MDCN) and nurses (RON)
- **Revoke access**: Remove doctor/nurse access when they leave the hospital
- **System oversight**: View system stats (patients, hospitals, records, connectivity)
- **Patient search**: Can search patients (for administrative purposes)

### What they cannot do
- **Cannot add medical records**: Admin does not perform clinical work; providers do
- **Clinical decisions**: No direct patient care or record creation

### Access flow
1. Admin registers a hospital
2. Admin (or hospital admin) goes to "Manage Doctors" for that hospital
3. Registers doctors and nurses with their MDCN/RON
4. When staff leave, Admin revokes their access

---

## Summary Table

| Capability              | Patient | Provider | Admin |
|-------------------------|---------|----------|-------|
| View own basic info     | Yes     | —        | —     |
| Request record access   | Yes     | —        | —     |
| View full records       | After approval | Yes (search by NIN) | Yes |
| Add medical records     | No      | Yes      | No    |
| Search patients by NIN  | No      | Yes      | Yes   |
| Register hospitals      | No      | No       | Yes   |
| Register/revoke doctors | No      | No       | Yes   |

---

## Record Types (Provider)

Providers can add these types of medical entries:

- **Diagnosis / Checkup** – General diagnosis or routine checkup
- **Lab Results** – CBC, blood work, etc.
- **Prescription** – Medications and dosages
- **Imaging** – X-ray, MRI, CT, ultrasound findings
- **Procedure** – Surgical or other medical procedures
