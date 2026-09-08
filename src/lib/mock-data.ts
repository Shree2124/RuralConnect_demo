import type {
  User,
  Beneficiary,
  HealthCase,
  Referral,
  Medicine,
  InventoryItem,
  Appointment,
  Reminder,
  Notification,
  HealthcareFacility,
  HealthCamp,
  NGO,
  SyncRecord,
  AuditLog,
  AccessibilityZone,
} from "../types";

// ============================
// USERS
// ============================
export const MOCK_USERS: User[] = [
  { id: "u1", name: "Meena Patil", email: "demo.patient@ruralconnect.in", mobile: "9876543210", role: "beneficiary", state: "Maharashtra", district: "Palghar", village: "Safale", pinCode: "401404", status: "active", lastActive: "2026-09-08T08:30:00", createdAt: "2026-03-15T00:00:00" },
  { id: "u2", name: "Rajesh Kumar", email: "demo.worker@ruralconnect.in", mobile: "9765432109", role: "field_worker", state: "Maharashtra", district: "Palghar", organization: "Seva Health NGO", assignedDistrict: "Palghar", assignedVillages: ["Safale", "Kasa", "Talasari", "Jawahar"], lastSync: "2026-09-08T06:20:00", deviceStatus: "online", status: "active", lastActive: "2026-09-08T09:00:00", createdAt: "2026-01-10T00:00:00" },
  { id: "u3", name: "Priya Sharma", email: "demo.ngo@ruralconnect.in", mobile: "9654321098", role: "ngo_admin", state: "Maharashtra", district: "Nashik", organization: "Seva Health NGO", status: "active", lastActive: "2026-09-08T09:15:00", createdAt: "2025-11-01T00:00:00" },
  { id: "u4", name: "Dr. Vikram Singh", email: "demo.doctor@ruralconnect.in", mobile: "9543210987", role: "doctor", state: "Maharashtra", district: "Palghar", organization: "PHC Palghar", status: "active", lastActive: "2026-09-08T08:45:00", createdAt: "2025-12-05T00:00:00" },
  { id: "u5", name: "Suresh Mehta", email: "demo.pharmacy@ruralconnect.in", mobile: "9432109876", role: "pharmacy", state: "Maharashtra", district: "Palghar", organization: "Community Pharmacy Palghar", status: "active", lastActive: "2026-09-08T09:00:00", createdAt: "2026-02-20T00:00:00" },
  { id: "u6", name: "Anita Desai", email: "demo.admin@ruralconnect.in", mobile: "9321098765", role: "admin", state: "Maharashtra", district: "Pune", status: "active", lastActive: "2026-09-08T09:30:00", createdAt: "2025-10-01T00:00:00" },
  // Additional field workers
  { id: "u7", name: "Sunita Yadav", email: "sunita.yadav@ruralconnect.in", mobile: "9210987654", role: "field_worker", state: "Rajasthan", district: "Barmer", organization: "Grameen Swasthya", assignedDistrict: "Barmer", assignedVillages: ["Ramsar", "Dhorimanna", "Chauhtan"], lastSync: "2026-09-07T18:00:00", deviceStatus: "offline", status: "active", lastActive: "2026-09-07T18:00:00", createdAt: "2026-01-20T00:00:00" },
  { id: "u8", name: "Raju Pawar", email: "raju.pawar@ruralconnect.in", mobile: "9109876543", role: "field_worker", state: "Maharashtra", district: "Nandurbar", organization: "Seva Health NGO", assignedDistrict: "Nandurbar", assignedVillages: ["Akkalkuwa", "Akrani", "Taloda"], lastSync: "2026-09-08T07:30:00", deviceStatus: "online", status: "active", lastActive: "2026-09-08T07:30:00", createdAt: "2026-02-05T00:00:00" },
  { id: "u9", name: "Dr. Rekha Nair", email: "rekha.nair@ruralconnect.in", mobile: "9098765432", role: "doctor", state: "Maharashtra", district: "Gadchiroli", organization: "CHC Gadchiroli", status: "active", lastActive: "2026-09-08T08:00:00", createdAt: "2026-01-15T00:00:00" },
  { id: "u10", name: "Mohan Rathod", email: "mohan.rathod@ruralconnect.in", mobile: "8987654321", role: "pharmacy", state: "Rajasthan", district: "Barmer", organization: "Jan Aushadhi Kendra Barmer", status: "active", lastActive: "2026-09-08T09:20:00", createdAt: "2026-03-01T00:00:00" },
];

// ============================
// BENEFICIARIES
// ============================
export const MOCK_BENEFICIARIES: Beneficiary[] = [
  { id: "b1", name: "Meena Patil", age: 32, gender: "female", mobile: "9876543210", state: "Maharashtra", district: "Palghar", village: "Safale", pinCode: "401404", symptoms: ["fever", "cough"], assignedWorker: "u2", assignedNgo: "ngo1", registeredAt: "2026-04-10T00:00:00", lastVisit: "2026-09-06T00:00:00", status: "active", ayushmanId: "AY-MH-20240041", aadharLast4: "3847" },
  { id: "b2", name: "Ramesh Pawar", age: 48, gender: "male", mobile: "9765432100", state: "Maharashtra", district: "Palghar", village: "Kasa", pinCode: "401405", symptoms: ["weakness", "stomach pain"], assignedWorker: "u2", assignedNgo: "ngo1", registeredAt: "2026-03-20T00:00:00", lastVisit: "2026-09-02T00:00:00", status: "referred", ayushmanId: "AY-MH-20240052" },
  { id: "b3", name: "Asha Shinde", age: 27, gender: "female", mobile: "9654321001", state: "Maharashtra", district: "Nandurbar", village: "Akkalkuwa", pinCode: "425415", assignedWorker: "u8", assignedNgo: "ngo1", registeredAt: "2026-05-01T00:00:00", lastVisit: "2026-08-28T00:00:00", status: "active", ayushmanId: "AY-MH-20240063" },
  { id: "b4", name: "Suresh Rathod", age: 55, gender: "male", mobile: "9543210002", state: "Rajasthan", district: "Barmer", village: "Ramsar", pinCode: "344001", symptoms: ["difficulty breathing", "chest pain"], assignedWorker: "u7", assignedNgo: "ngo2", registeredAt: "2026-02-15T00:00:00", lastVisit: "2026-09-05T00:00:00", status: "referred", ayushmanId: "AY-RJ-20240011" },
  { id: "b5", name: "Kavita Jadhav", age: 22, gender: "female", mobile: "9432100003", state: "Maharashtra", district: "Gadchiroli", village: "Chamorshi", pinCode: "442605", assignedWorker: "u2", assignedNgo: "ngo3", registeredAt: "2026-06-10T00:00:00", lastVisit: "2026-09-01T00:00:00", status: "active" },
  { id: "b6", name: "Dinesh Jagtap", age: 38, gender: "male", mobile: "9321000004", state: "Maharashtra", district: "Palghar", village: "Talasari", pinCode: "401606", assignedWorker: "u2", assignedNgo: "ngo1", registeredAt: "2026-04-22T00:00:00", status: "active" },
  { id: "b7", name: "Pushpa Bai", age: 60, gender: "female", mobile: "9210000005", state: "Rajasthan", district: "Barmer", village: "Dhorimanna", pinCode: "344035", symptoms: ["headache", "weakness"], assignedWorker: "u7", assignedNgo: "ngo2", registeredAt: "2026-01-30T00:00:00", lastVisit: "2026-08-20T00:00:00", status: "active" },
  { id: "b8", name: "Sanjay Bhil", age: 35, gender: "male", mobile: "9109000006", state: "Gujarat", district: "Dahod", village: "Limkheda", pinCode: "389230", assignedWorker: "u2", assignedNgo: "ngo4", registeredAt: "2026-05-15T00:00:00", status: "active" },
  { id: "b9", name: "Lakshmi Devi", age: 45, gender: "female", mobile: "9008000007", state: "Odisha", district: "Kalahandi", village: "Bhawanipatna", pinCode: "766001", registeredAt: "2026-07-01T00:00:00", status: "active" },
  { id: "b10", name: "Arjun Singh", age: 29, gender: "male", mobile: "8907000008", state: "Uttar Pradesh", district: "Shravasti", village: "Ikauna", pinCode: "271831", registeredAt: "2026-06-20T00:00:00", status: "active" },
  { id: "b11", name: "Geeta Kumari", age: 41, gender: "female", mobile: "8806000009", state: "Madhya Pradesh", district: "Sheopur", village: "Karahal", pinCode: "476337", registeredAt: "2026-04-05T00:00:00", status: "active" },
  { id: "b12", name: "Rahul Gond", age: 19, gender: "male", mobile: "8705000010", state: "Maharashtra", district: "Gadchiroli", village: "Etapalli", pinCode: "442702", registeredAt: "2026-08-01T00:00:00", status: "active" },
  { id: "b13", name: "Sunita Nayak", age: 33, gender: "female", mobile: "8604000011", state: "Odisha", district: "Koraput", village: "Jeypore", pinCode: "764001", registeredAt: "2026-07-10T00:00:00", status: "active" },
  { id: "b14", name: "Mangal Das", age: 52, gender: "male", mobile: "8503000012", state: "Rajasthan", district: "Jaisalmer", village: "Sam", pinCode: "345001", registeredAt: "2026-03-25T00:00:00", status: "referred" },
  { id: "b15", name: "Rekha Banjara", age: 28, gender: "female", mobile: "8402000013", state: "Haryana", district: "Mewat", village: "Nuh", pinCode: "122107", registeredAt: "2026-05-30T00:00:00", status: "active" },
  { id: "b16", name: "Prakash Warli", age: 44, gender: "male", mobile: "8301000014", state: "Maharashtra", district: "Palghar", village: "Jawahar", pinCode: "401302", registeredAt: "2026-02-28T00:00:00", status: "active" },
  { id: "b17", name: "Savita More", age: 37, gender: "female", mobile: "8200000015", state: "Maharashtra", district: "Nashik", village: "Surgana", pinCode: "422211", registeredAt: "2026-06-15T00:00:00", status: "active" },
  { id: "b18", name: "Bhagwat Solanki", age: 63, gender: "male", mobile: "9100000016", state: "Gujarat", district: "Banaskantha", village: "Dhanera", pinCode: "385310", registeredAt: "2026-04-18T00:00:00", status: "active" },
  { id: "b19", name: "Kamla Meena", age: 24, gender: "female", mobile: "9200000017", state: "Rajasthan", district: "Dungarpur", village: "Sagwara", pinCode: "314025", registeredAt: "2026-07-22T00:00:00", status: "active" },
  { id: "b20", name: "Devraj Murmu", age: 47, gender: "male", mobile: "9300000018", state: "Odisha", district: "Malkangiri", village: "Malkangiri", pinCode: "764045", registeredAt: "2026-05-05T00:00:00", status: "active" },
  { id: "b21", name: "Chandramati Verma", age: 56, gender: "female", mobile: "9400000019", state: "Uttar Pradesh", district: "Bahraich", village: "Nawabganj", pinCode: "271801", registeredAt: "2026-03-12T00:00:00", status: "closed" },
  { id: "b22", name: "Santosh Patel", age: 39, gender: "male", mobile: "9500000020", state: "Madhya Pradesh", district: "Betul", village: "Multai", pinCode: "460661", registeredAt: "2026-08-10T00:00:00", status: "active" },
  { id: "b23", name: "Lalita Ahir", age: 31, gender: "female", mobile: "9600000021", state: "Gujarat", district: "Kutch", village: "Bhuj", pinCode: "370001", registeredAt: "2026-06-28T00:00:00", status: "active" },
  { id: "b24", name: "Mohan Lal Koli", age: 42, gender: "male", mobile: "9700000022", state: "Rajasthan", district: "Udaipur", village: "Kharwa", pinCode: "313001", registeredAt: "2026-04-30T00:00:00", status: "active" },
  { id: "b25", name: "Annapurna Devi", age: 58, gender: "female", mobile: "9800000023", state: "Haryana", district: "Sirsa", village: "Ellenabad", pinCode: "125102", registeredAt: "2026-05-20T00:00:00", status: "active" },
  { id: "b26", name: "Rajendra Prasad", age: 50, gender: "male", mobile: "9900000024", state: "Karnataka", district: "Raichur", village: "Manvi", pinCode: "584123", registeredAt: "2026-07-15T00:00:00", status: "active" },
  { id: "b27", name: "Usha Rani", age: 26, gender: "female", mobile: "8800000025", state: "Punjab", district: "Gurdaspur", village: "Batala", pinCode: "143505", registeredAt: "2026-08-05T00:00:00", status: "active" },
  { id: "b28", name: "Tara Chand Bhil", age: 34, gender: "male", mobile: "8700000026", state: "Madhya Pradesh", district: "Shivpuri", village: "Pichhore", pinCode: "473995", registeredAt: "2026-06-01T00:00:00", status: "active" },
  { id: "b29", name: "Sarita Devi", age: 43, gender: "female", mobile: "8600000027", state: "Himachal Pradesh", district: "Kinnaur", village: "Reckong Peo", pinCode: "172107", registeredAt: "2026-07-28T00:00:00", status: "active" },
  { id: "b30", name: "Ghanshyam Rawat", age: 61, gender: "male", mobile: "8500000028", state: "Uttar Pradesh", district: "Lakhimpur Kheri", village: "Pallia", pinCode: "262902", registeredAt: "2026-03-08T00:00:00", status: "active" },
];

// ============================
// CASES
// ============================
export const MOCK_CASES: HealthCase[] = [
  { id: "c1", beneficiaryId: "b1", beneficiaryName: "Meena Patil", village: "Safale", district: "Palghar", state: "Maharashtra", symptoms: ["fever", "cough", "headache"], severity: "moderate", status: "referred", createdBy: "u2", createdAt: "2026-09-05T09:00:00", updatedAt: "2026-09-06T10:30:00", referralId: "r1" },
  { id: "c2", beneficiaryId: "b2", beneficiaryName: "Ramesh Pawar", village: "Kasa", district: "Palghar", state: "Maharashtra", symptoms: ["weakness", "stomach pain", "vomiting"], severity: "moderate", status: "referred", createdBy: "u2", createdAt: "2026-09-02T10:00:00", updatedAt: "2026-09-03T11:00:00", referralId: "r2" },
  { id: "c3", beneficiaryId: "b4", beneficiaryName: "Suresh Rathod", village: "Ramsar", district: "Barmer", state: "Rajasthan", symptoms: ["difficulty breathing", "chest pain", "fever"], severity: "high", status: "referred", createdBy: "u7", createdAt: "2026-09-04T14:00:00", updatedAt: "2026-09-05T08:00:00", referralId: "r3" },
  { id: "c4", beneficiaryId: "b5", beneficiaryName: "Kavita Jadhav", village: "Chamorshi", district: "Gadchiroli", state: "Maharashtra", symptoms: ["fever", "body ache"], severity: "low", status: "open", createdBy: "u2", createdAt: "2026-09-07T11:00:00", updatedAt: "2026-09-07T11:00:00" },
  { id: "c5", beneficiaryId: "b7", beneficiaryName: "Pushpa Bai", village: "Dhorimanna", district: "Barmer", state: "Rajasthan", symptoms: ["headache", "weakness", "dizziness"], severity: "low", status: "open", createdBy: "u7", createdAt: "2026-09-06T15:30:00", updatedAt: "2026-09-06T15:30:00" },
  { id: "c6", beneficiaryId: "b3", beneficiaryName: "Asha Shinde", village: "Akkalkuwa", district: "Nandurbar", state: "Maharashtra", symptoms: ["cough", "fever", "difficulty breathing"], severity: "high", status: "referred", createdBy: "u8", createdAt: "2026-09-03T09:00:00", updatedAt: "2026-09-04T10:00:00", referralId: "r4", isOffline: false },
  { id: "c7", beneficiaryId: "b6", beneficiaryName: "Dinesh Jagtap", village: "Talasari", district: "Palghar", state: "Maharashtra", symptoms: ["injury", "pain"], severity: "moderate", status: "closed", createdBy: "u2", createdAt: "2026-08-28T10:00:00", updatedAt: "2026-08-30T12:00:00" },
  { id: "c8", beneficiaryId: "b12", beneficiaryName: "Rahul Gond", village: "Etapalli", district: "Gadchiroli", state: "Maharashtra", symptoms: ["fever", "malaria-like symptoms"], severity: "high", status: "open", createdBy: "u2", createdAt: "2026-09-08T08:00:00", updatedAt: "2026-09-08T08:00:00", isOffline: true, notes: "Saved offline — pending sync" },
];

// ============================
// REFERRALS
// ============================
export const MOCK_REFERRALS: Referral[] = [
  { id: "r1", caseId: "c1", beneficiaryId: "b1", beneficiaryName: "Meena Patil", fromWorkerId: "u2", toFacilityId: "hf1", toFacilityName: "PHC Palghar", toDoctorId: "u4", toDoctorName: "Dr. Vikram Singh", priority: "moderate", reason: "Persistent fever and cough for 5 days", symptoms: ["fever", "cough", "headache"], status: "scheduled", createdAt: "2026-09-06T10:30:00", scheduledDate: "2026-09-09T10:00:00", district: "Palghar", state: "Maharashtra" },
  { id: "r2", caseId: "c2", beneficiaryId: "b2", beneficiaryName: "Ramesh Pawar", fromWorkerId: "u2", toFacilityId: "hf1", toFacilityName: "PHC Palghar", toDoctorId: "u4", toDoctorName: "Dr. Vikram Singh", priority: "moderate", reason: "Abdominal pain with vomiting", symptoms: ["weakness", "stomach pain", "vomiting"], status: "pending", createdAt: "2026-09-03T11:00:00", district: "Palghar", state: "Maharashtra" },
  { id: "r3", caseId: "c3", beneficiaryId: "b4", beneficiaryName: "Suresh Rathod", fromWorkerId: "u7", toFacilityId: "hf3", toFacilityName: "District Hospital Barmer", priority: "high", reason: "Difficulty breathing with chest pain — urgent evaluation needed", symptoms: ["difficulty breathing", "chest pain", "fever"], status: "accepted", createdAt: "2026-09-05T08:00:00", district: "Barmer", state: "Rajasthan" },
  { id: "r4", caseId: "c6", beneficiaryId: "b3", beneficiaryName: "Asha Shinde", fromWorkerId: "u8", toFacilityId: "hf2", toFacilityName: "CHC Nandurbar", toDoctorId: "u9", toDoctorName: "Dr. Rekha Nair", priority: "high", reason: "High fever with breathing difficulty", symptoms: ["cough", "fever", "difficulty breathing"], status: "accepted", createdAt: "2026-09-04T10:00:00", district: "Nandurbar", state: "Maharashtra" },
  { id: "r5", caseId: "c5", beneficiaryId: "b7", beneficiaryName: "Pushpa Bai", fromWorkerId: "u7", toFacilityId: "hf4", toFacilityName: "Ayushman Arogya Mandir Dhorimanna", priority: "low", reason: "Recurring headache and weakness", symptoms: ["headache", "weakness", "dizziness"], status: "pending", createdAt: "2026-09-07T09:00:00", district: "Barmer", state: "Rajasthan" },
  // More referrals
  { id: "r6", caseId: "c7", beneficiaryId: "b6", beneficiaryName: "Dinesh Jagtap", fromWorkerId: "u2", toFacilityId: "hf1", toFacilityName: "PHC Palghar", priority: "moderate", reason: "Injury treatment follow-up", symptoms: ["injury", "pain"], status: "completed", createdAt: "2026-08-28T11:00:00", completedAt: "2026-08-30T12:00:00", district: "Palghar", state: "Maharashtra" },
  { id: "r7", caseId: "c4", beneficiaryId: "b5", beneficiaryName: "Kavita Jadhav", fromWorkerId: "u2", toFacilityId: "hf5", toFacilityName: "Sub-Centre Chamorshi", priority: "low", reason: "Fever monitoring", symptoms: ["fever", "body ache"], status: "pending", createdAt: "2026-09-07T12:00:00", district: "Gadchiroli", state: "Maharashtra" },
  // Offline-created referral
  { id: "r8", caseId: "c8", beneficiaryId: "b12", beneficiaryName: "Rahul Gond", fromWorkerId: "u2", toFacilityId: "hf2", toFacilityName: "CHC Gadchiroli", priority: "high", reason: "Suspected malaria — urgent lab test required", symptoms: ["fever", "malaria-like symptoms"], status: "pending", createdAt: "2026-09-08T08:30:00", district: "Gadchiroli", state: "Maharashtra", notes: "Created offline — pending sync" },
];

// ============================
// MEDICINES
// ============================
export const MOCK_MEDICINES: Medicine[] = [
  { id: "m1", name: "Paracetamol 500mg", genericName: "Paracetamol", category: "Analgesic / Antipyretic", stockStatus: "available", quantity: 120, providerId: "ph1", providerName: "Community Pharmacy Palghar", providerType: "pharmacy", location: "Palghar, Maharashtra", district: "Palghar", state: "Maharashtra", distance: 4.2, price: 12, lastUpdated: "2026-09-08T07:00:00", batchNumber: "B2026PAR01", expiryDate: "2027-06-30" },
  { id: "m2", name: "Paracetamol 500mg", genericName: "Paracetamol", category: "Analgesic / Antipyretic", stockStatus: "available", quantity: 450, providerId: "ngo1", providerName: "Seva Health NGO", providerType: "ngo", location: "Palghar, Maharashtra", district: "Palghar", state: "Maharashtra", distance: 2.8, price: 0, lastUpdated: "2026-09-07T16:00:00", batchNumber: "NGO-PAR-2026", expiryDate: "2026-12-31" },
  { id: "m3", name: "ORS Sachet", genericName: "Oral Rehydration Salts", category: "Electrolyte / Hydration", stockStatus: "available", quantity: 200, providerId: "ph1", providerName: "Community Pharmacy Palghar", providerType: "pharmacy", location: "Palghar, Maharashtra", district: "Palghar", state: "Maharashtra", distance: 4.2, price: 5, lastUpdated: "2026-09-08T07:00:00", batchNumber: "B2026ORS01", expiryDate: "2027-03-31" },
  { id: "m4", name: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "Antibiotic", stockStatus: "low_stock", quantity: 18, providerId: "ph1", providerName: "Community Pharmacy Palghar", providerType: "pharmacy", location: "Palghar, Maharashtra", district: "Palghar", state: "Maharashtra", distance: 4.2, price: 45, lastUpdated: "2026-09-08T07:00:00", batchNumber: "B2026AMX01", expiryDate: "2027-01-31" },
  { id: "m5", name: "Metformin 500mg", genericName: "Metformin Hydrochloride", category: "Antidiabetic", stockStatus: "available", quantity: 80, providerId: "ph2", providerName: "Jan Aushadhi Kendra Barmer", providerType: "pharmacy", location: "Barmer, Rajasthan", district: "Barmer", state: "Rajasthan", distance: 8.5, price: 22, lastUpdated: "2026-09-07T14:00:00", batchNumber: "B2026MET01", expiryDate: "2027-09-30" },
  { id: "m6", name: "Chloroquine 250mg", genericName: "Chloroquine Phosphate", category: "Antimalarial", stockStatus: "low_stock", quantity: 12, providerId: "ngo2", providerName: "Grameen Swasthya NGO", providerType: "ngo", location: "Barmer, Rajasthan", district: "Barmer", state: "Rajasthan", distance: 3.1, price: 0, lastUpdated: "2026-09-06T12:00:00" },
  { id: "m7", name: "Amlodipine 5mg", genericName: "Amlodipine Besylate", category: "Antihypertensive", stockStatus: "available", quantity: 200, providerId: "ph3", providerName: "Mahaveer Medical Store", providerType: "pharmacy", location: "Nashik, Maharashtra", district: "Nashik", state: "Maharashtra", distance: 12.0, price: 35, lastUpdated: "2026-09-08T08:00:00" },
  { id: "m8", name: "Iron Folic Acid Tab", genericName: "Ferrous Sulphate + Folic Acid", category: "Nutritional Supplement", stockStatus: "available", quantity: 350, providerId: "ngo1", providerName: "Seva Health NGO", providerType: "ngo", location: "Palghar, Maharashtra", district: "Palghar", state: "Maharashtra", distance: 2.8, price: 0, lastUpdated: "2026-09-07T16:00:00" },
  { id: "m9", name: "Cotrimoxazole 480mg", genericName: "Cotrimoxazole", category: "Antibiotic", stockStatus: "out_of_stock", quantity: 0, providerId: "ph1", providerName: "Community Pharmacy Palghar", providerType: "pharmacy", location: "Palghar, Maharashtra", district: "Palghar", state: "Maharashtra", distance: 4.2, price: 28, lastUpdated: "2026-09-05T10:00:00" },
  { id: "m10", name: "Azithromycin 500mg", genericName: "Azithromycin", category: "Antibiotic", stockStatus: "expiring_soon", quantity: 30, providerId: "ph4", providerName: "Akash Medical Store", providerType: "pharmacy", location: "Gadchiroli, Maharashtra", district: "Gadchiroli", state: "Maharashtra", distance: 9.3, price: 85, lastUpdated: "2026-09-07T09:00:00", expiryDate: "2026-09-26" },
  { id: "m11", name: "Enalapril 5mg", genericName: "Enalapril Maleate", category: "Antihypertensive", stockStatus: "available", quantity: 150, providerId: "ph2", providerName: "Jan Aushadhi Kendra Barmer", providerType: "pharmacy", location: "Barmer, Rajasthan", district: "Barmer", state: "Rajasthan", distance: 8.5, price: 18, lastUpdated: "2026-09-07T14:00:00" },
  { id: "m12", name: "Vitamin B12 Injection", genericName: "Cyanocobalamin", category: "Vitamin", stockStatus: "available", quantity: 40, providerId: "ngo3", providerName: "Tribal Health NGO", providerType: "ngo", location: "Gadchiroli, Maharashtra", district: "Gadchiroli", state: "Maharashtra", distance: 6.7, price: 0, lastUpdated: "2026-09-06T11:00:00" },
  { id: "m13", name: "Antacid Suspension", genericName: "Magnesium Hydroxide + Aluminium Hydroxide", category: "Antacid", stockStatus: "available", quantity: 60, providerId: "ph5", providerName: "Health Plus Pharmacy", providerType: "pharmacy", location: "Dahod, Gujarat", district: "Dahod", state: "Gujarat", distance: 5.5, price: 42, lastUpdated: "2026-09-08T09:00:00" },
  { id: "m14", name: "Salbutamol Inhaler", genericName: "Salbutamol Sulphate", category: "Bronchodilator", stockStatus: "low_stock", quantity: 8, providerId: "ph3", providerName: "Mahaveer Medical Store", providerType: "pharmacy", location: "Nashik, Maharashtra", district: "Nashik", state: "Maharashtra", distance: 12.0, price: 95, lastUpdated: "2026-09-07T10:00:00" },
  { id: "m15", name: "Ciprofloxacin 500mg", genericName: "Ciprofloxacin HCl", category: "Antibiotic", stockStatus: "available", quantity: 90, providerId: "ph1", providerName: "Community Pharmacy Palghar", providerType: "pharmacy", location: "Palghar, Maharashtra", district: "Palghar", state: "Maharashtra", distance: 4.2, price: 55, lastUpdated: "2026-09-08T07:00:00" },
];

// ============================
// INVENTORY
// ============================
export const MOCK_INVENTORY: InventoryItem[] = [
  { id: "i1", name: "Paracetamol 500mg", genericName: "Paracetamol", category: "Analgesic", batchNumber: "B2026PAR01", quantity: 120, expiryDate: "2027-06-30", location: "Palghar Store", district: "Palghar", state: "Maharashtra", status: "available", providerId: "ph1", updatedAt: "2026-09-08T07:00:00", price: 12 },
  { id: "i2", name: "ORS Sachet", genericName: "Oral Rehydration Salts", category: "Electrolyte", batchNumber: "B2026ORS01", quantity: 200, expiryDate: "2027-03-31", location: "Palghar Store", district: "Palghar", state: "Maharashtra", status: "available", providerId: "ph1", updatedAt: "2026-09-08T07:00:00", price: 5 },
  { id: "i3", name: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "Antibiotic", batchNumber: "B2026AMX01", quantity: 18, expiryDate: "2027-01-31", location: "Palghar Store", district: "Palghar", state: "Maharashtra", status: "low_stock", providerId: "ph1", updatedAt: "2026-09-08T07:00:00", price: 45 },
  { id: "i4", name: "Cotrimoxazole 480mg", genericName: "Cotrimoxazole", category: "Antibiotic", batchNumber: "B2025CTX01", quantity: 0, expiryDate: "2027-04-30", location: "Palghar Store", district: "Palghar", state: "Maharashtra", status: "out_of_stock", providerId: "ph1", updatedAt: "2026-09-05T10:00:00", price: 28 },
  { id: "i5", name: "Azithromycin 500mg", genericName: "Azithromycin", category: "Antibiotic", batchNumber: "B2025AZI02", quantity: 30, expiryDate: "2026-09-26", location: "Gadchiroli Store", district: "Gadchiroli", state: "Maharashtra", status: "expiring_soon", providerId: "ph4", updatedAt: "2026-09-07T09:00:00", price: 85 },
  { id: "i6", name: "Iron Folic Acid", genericName: "Ferrous Sulphate + Folic Acid", category: "Supplement", batchNumber: "NGO-IFA-2026", quantity: 350, expiryDate: "2027-02-28", location: "Palghar NGO Store", district: "Palghar", state: "Maharashtra", status: "available", providerId: "ngo1", updatedAt: "2026-09-07T16:00:00", price: 0 },
  { id: "i7", name: "Chloroquine 250mg", genericName: "Chloroquine Phosphate", category: "Antimalarial", batchNumber: "NGO-CQ-2026", quantity: 12, expiryDate: "2027-06-30", location: "Barmer NGO Store", district: "Barmer", state: "Rajasthan", status: "low_stock", providerId: "ngo2", updatedAt: "2026-09-06T12:00:00", price: 0 },
  { id: "i8", name: "Salbutamol Inhaler", genericName: "Salbutamol", category: "Respiratory", batchNumber: "B2026SAL01", quantity: 8, expiryDate: "2027-08-31", location: "Nashik Store", district: "Nashik", state: "Maharashtra", status: "low_stock", providerId: "ph3", updatedAt: "2026-09-07T10:00:00", price: 95 },
  { id: "i9", name: "Metformin 500mg", genericName: "Metformin HCl", category: "Antidiabetic", batchNumber: "B2026MET01", quantity: 80, expiryDate: "2027-09-30", location: "Barmer Store", district: "Barmer", state: "Rajasthan", status: "available", providerId: "ph2", updatedAt: "2026-09-07T14:00:00", price: 22 },
  { id: "i10", name: "Ciprofloxacin 500mg", genericName: "Ciprofloxacin HCl", category: "Antibiotic", batchNumber: "B2026CIP01", quantity: 90, expiryDate: "2027-05-31", location: "Palghar Store", district: "Palghar", state: "Maharashtra", status: "available", providerId: "ph1", updatedAt: "2026-09-08T07:00:00", price: 55 },
];

// ============================
// APPOINTMENTS
// ============================
export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "ap1", beneficiaryId: "b1", beneficiaryName: "Meena Patil", doctorId: "u4", doctorName: "Dr. Vikram Singh", facilityId: "hf1", facilityName: "PHC Palghar", type: "follow_up", date: "2026-09-09", time: "10:00 AM", status: "scheduled", district: "Palghar", state: "Maharashtra" },
  { id: "ap2", beneficiaryId: "b2", beneficiaryName: "Ramesh Pawar", doctorId: "u4", doctorName: "Dr. Vikram Singh", facilityId: "hf1", facilityName: "PHC Palghar", type: "consultation", date: "2026-09-10", time: "11:30 AM", status: "scheduled", district: "Palghar", state: "Maharashtra" },
  { id: "ap3", beneficiaryId: "b4", beneficiaryName: "Suresh Rathod", facilityId: "hf3", facilityName: "District Hospital Barmer", type: "referral", date: "2026-09-08", time: "09:00 AM", status: "scheduled", district: "Barmer", state: "Rajasthan" },
  { id: "ap4", beneficiaryId: "b3", beneficiaryName: "Asha Shinde", doctorId: "u9", doctorName: "Dr. Rekha Nair", facilityId: "hf2", facilityName: "CHC Nandurbar", type: "consultation", date: "2026-09-11", time: "10:30 AM", status: "scheduled", district: "Nandurbar", state: "Maharashtra" },
  { id: "ap5", beneficiaryId: "b5", beneficiaryName: "Kavita Jadhav", facilityId: "hf5", facilityName: "Sub-Centre Chamorshi", type: "follow_up", date: "2026-09-15", time: "09:30 AM", status: "scheduled", district: "Gadchiroli", state: "Maharashtra" },
  { id: "ap6", beneficiaryId: "b1", beneficiaryName: "Meena Patil", facilityId: "hf6", facilityName: "Ayushman Arogya Mandir Safale", type: "vaccination", date: "2026-09-15", time: "08:00 AM", status: "scheduled", notes: "Tetanus booster", district: "Palghar", state: "Maharashtra" },
  { id: "ap7", beneficiaryId: "b6", beneficiaryName: "Dinesh Jagtap", doctorId: "u4", doctorName: "Dr. Vikram Singh", facilityId: "hf1", facilityName: "PHC Palghar", type: "follow_up", date: "2026-08-30", time: "10:00 AM", status: "completed", district: "Palghar", state: "Maharashtra" },
  { id: "ap8", beneficiaryId: "b7", beneficiaryName: "Pushpa Bai", facilityId: "hf4", facilityName: "Ayushman Arogya Mandir Dhorimanna", type: "consultation", date: "2026-09-12", time: "11:00 AM", status: "scheduled", district: "Barmer", state: "Rajasthan" },
];

// ============================
// REMINDERS
// ============================
export const MOCK_REMINDERS: Reminder[] = [
  { id: "rem1", beneficiaryId: "b1", title: "Take Paracetamol", description: "Take Paracetamol 500mg — 1 tablet after breakfast", type: "medication", dueDate: "2026-09-09", dueTime: "08:00 AM", frequency: "daily", channels: ["in_app", "sms"], status: "active" },
  { id: "rem2", beneficiaryId: "b1", title: "Follow-up Appointment", description: "Visit PHC Palghar for follow-up with Dr. Vikram Singh", type: "follow_up", dueDate: "2026-09-09", dueTime: "10:00 AM", frequency: "once", channels: ["in_app", "sms"], status: "active" },
  { id: "rem3", beneficiaryId: "b1", title: "Tetanus Vaccination", description: "Scheduled tetanus booster at Ayushman Arogya Mandir", type: "vaccination", dueDate: "2026-09-15", dueTime: "08:00 AM", frequency: "once", channels: ["in_app"], status: "active" },
  { id: "rem4", beneficiaryId: "b2", title: "Take Metformin", description: "Take Metformin 500mg — 1 tablet after lunch", type: "medication", dueDate: "2026-09-09", dueTime: "01:00 PM", frequency: "daily", channels: ["in_app", "ussd"], status: "active" },
  { id: "rem5", beneficiaryId: "b4", title: "District Hospital Visit", description: "Urgent — Visit District Hospital Barmer today", type: "referral", dueDate: "2026-09-08", dueTime: "09:00 AM", frequency: "once", channels: ["in_app", "sms", "ivr"], status: "sent" },
];

// ============================
// NOTIFICATIONS
// ============================
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", userId: "u1", title: "Medicine Available", message: "Paracetamol 500mg is available at Community Pharmacy Palghar — 4.2 km away.", category: "medicine", isRead: false, createdAt: "2026-09-08T08:00:00" },
  { id: "n2", userId: "u1", title: "Follow-up Scheduled", message: "Your follow-up appointment with Dr. Vikram Singh is scheduled for tomorrow, 10:00 AM at PHC Palghar.", category: "appointment", isRead: false, createdAt: "2026-09-08T07:30:00" },
  { id: "n3", userId: "u1", title: "Vaccination Reminder", message: "Your tetanus booster vaccination is due on 15 September at Ayushman Arogya Mandir.", category: "appointment", isRead: true, createdAt: "2026-09-07T09:00:00" },
  { id: "n4", userId: "u2", title: "Sync Complete", message: "8 records synchronized successfully.", category: "sync", isRead: false, createdAt: "2026-09-08T06:20:00" },
  { id: "n5", userId: "u2", title: "New Referral Created", message: "Referral for Meena Patil has been sent to PHC Palghar.", category: "referral", isRead: true, createdAt: "2026-09-06T10:30:00" },
  { id: "n6", userId: "u4", title: "New Referral Received", message: "Urgent referral from field worker for Suresh Rathod — High priority case.", category: "referral", isRead: false, createdAt: "2026-09-05T08:00:00" },
  { id: "n7", userId: "u4", title: "Follow-up Due", message: "Follow-up for Meena Patil is scheduled for tomorrow 10:00 AM.", category: "appointment", isRead: false, createdAt: "2026-09-08T08:00:00" },
  { id: "n8", userId: "u3", title: "Health Camp Upcoming", message: "Community Health Camp at Palghar is scheduled for 28 September 2026.", category: "health_camp", isRead: false, createdAt: "2026-09-07T10:00:00" },
  { id: "n9", userId: "u5", title: "Low Stock Alert", message: "Amoxicillin 500mg stock is critically low (18 units remaining).", category: "medicine", isRead: false, createdAt: "2026-09-08T07:00:00" },
  { id: "n10", userId: "u5", title: "Expiry Alert", message: "Azithromycin 500mg (Batch B2025AZI02) expires in 18 days.", category: "medicine", isRead: false, createdAt: "2026-09-08T07:00:00" },
  { id: "n11", userId: "u6", title: "New Beneficiary Registered", message: "Field Worker Rajesh Kumar registered new beneficiary: Rahul Gond.", category: "system", isRead: false, createdAt: "2026-09-08T08:05:00" },
  { id: "n12", userId: "u6", title: "System: 3 Pending Syncs", message: "3 field worker records are pending synchronization.", category: "sync", isRead: false, createdAt: "2026-09-08T07:45:00" },
  { id: "n13", userId: "u1", title: "Health Camp Near You", message: "Community Health Camp is coming to Palghar on 28 September — Free consultation and medicines!", category: "health_camp", isRead: false, createdAt: "2026-09-07T11:00:00" },
  { id: "n14", userId: "u2", title: "High Priority Case", message: "Suresh Rathod (Barmer) has been flagged as high priority — review needed.", category: "referral", isRead: true, createdAt: "2026-09-05T08:00:00" },
  { id: "n15", userId: "u4", title: "Referral Accepted", message: "You have accepted the referral for Asha Shinde. Case scheduled for 11 Sep.", category: "referral", isRead: true, createdAt: "2026-09-04T10:00:00" },
  { id: "n16", userId: "u3", title: "Low Medicine Stock", message: "Chloroquine 250mg stock at Barmer NGO Store is critically low (12 units).", category: "medicine", isRead: false, createdAt: "2026-09-06T12:00:00" },
  { id: "n17", userId: "u2", title: "Field Visit Reminder", message: "You have 3 beneficiary visits scheduled today in Safale and Kasa.", category: "appointment", isRead: false, createdAt: "2026-09-08T06:00:00" },
  { id: "n18", userId: "u1", title: "Medicine Reminder", message: "Time to take your Paracetamol 500mg — 1 tablet after breakfast.", category: "medicine", isRead: false, createdAt: "2026-09-08T08:00:00" },
  { id: "n19", userId: "u6", title: "Audit: Doctor accepted referral", message: "Dr. Vikram Singh accepted referral for Asha Shinde.", category: "system", isRead: true, createdAt: "2026-09-04T10:30:00" },
  { id: "n20", userId: "u5", title: "Medicine Request", message: "Beneficiary requested Paracetamol 500mg — available in stock.", category: "medicine", isRead: false, createdAt: "2026-09-08T09:00:00" },
];

// ============================
// HEALTHCARE FACILITIES
// ============================
export const MOCK_FACILITIES: HealthcareFacility[] = [
  { id: "hf1", name: "PHC Palghar", type: "phc", lat: 19.698, lng: 72.769, address: "Near ST Bus Stand, Palghar", district: "Palghar", state: "Maharashtra", pinCode: "401404", contactNumber: "02525-252841", doctors: 2, beds: 6, operatingHours: "8 AM – 4 PM (Mon–Sat)", services: ["OPD", "Maternity", "Vaccination", "Lab"], accessibilityScore: 72 },
  { id: "hf2", name: "CHC Nandurbar", type: "chc", lat: 21.362, lng: 74.240, address: "Civil Hospital Road, Nandurbar", district: "Nandurbar", state: "Maharashtra", pinCode: "425412", contactNumber: "02564-222101", doctors: 5, beds: 30, operatingHours: "24 Hours", services: ["OPD", "IPD", "Surgery", "Maternity", "ICU", "Lab", "Pharmacy"], accessibilityScore: 68 },
  { id: "hf3", name: "District Hospital Barmer", type: "district_hospital", lat: 25.752, lng: 71.393, address: "Hospital Road, Barmer", district: "Barmer", state: "Rajasthan", pinCode: "344001", contactNumber: "02982-220101", doctors: 12, beds: 100, operatingHours: "24 Hours", services: ["Emergency", "Surgery", "ICU", "Radiology", "Pharmacy", "Blood Bank"], accessibilityScore: 60 },
  { id: "hf4", name: "Ayushman Arogya Mandir Dhorimanna", type: "arogya_mandir", lat: 25.389, lng: 71.956, address: "Main Road, Dhorimanna", district: "Barmer", state: "Rajasthan", pinCode: "344035", doctors: 1, beds: 2, operatingHours: "9 AM – 3 PM (Mon–Sat)", services: ["OPD", "Vaccination", "Wellness"], accessibilityScore: 35 },
  { id: "hf5", name: "Sub-Centre Chamorshi", type: "sub_centre", lat: 20.214, lng: 79.912, address: "Village Chamorshi", district: "Gadchiroli", state: "Maharashtra", pinCode: "442605", doctors: 0, beds: 0, operatingHours: "9 AM – 1 PM", services: ["ANM Visit", "Vaccination", "Basic Medicines"], accessibilityScore: 28 },
  { id: "hf6", name: "Ayushman Arogya Mandir Safale", type: "arogya_mandir", lat: 19.723, lng: 72.818, address: "Safale Village Road", district: "Palghar", state: "Maharashtra", pinCode: "401404", doctors: 1, beds: 1, operatingHours: "9 AM – 2 PM (Mon–Fri)", services: ["OPD", "Vaccination", "ANC", "Wellness"], accessibilityScore: 55 },
  { id: "hf7", name: "PHC Akkalkuwa", type: "phc", lat: 21.550, lng: 74.020, address: "Akkalkuwa Town", district: "Nandurbar", state: "Maharashtra", pinCode: "425415", contactNumber: "02567-260101", doctors: 2, beds: 6, operatingHours: "8 AM – 4 PM (Mon–Sat)", services: ["OPD", "Maternity", "Vaccination"], accessibilityScore: 42 },
  { id: "hf8", name: "Community Health Camp — Palghar", type: "ngo_camp", lat: 19.700, lng: 72.770, address: "Gram Panchayat Ground, Palghar", district: "Palghar", state: "Maharashtra", pinCode: "401404", services: ["General OPD", "Medicines", "Vaccination", "Health Awareness"], accessibilityScore: 80 },
  { id: "hf9", name: "PHC Chauhtan", type: "phc", lat: 25.249, lng: 71.267, address: "Chauhtan Town, Barmer", district: "Barmer", state: "Rajasthan", pinCode: "344031", doctors: 1, beds: 4, services: ["OPD", "Vaccination"], accessibilityScore: 30 },
  { id: "hf10", name: "CHC Gadchiroli", type: "chc", lat: 20.100, lng: 80.000, address: "Civil Lines, Gadchiroli", district: "Gadchiroli", state: "Maharashtra", pinCode: "442605", doctors: 6, beds: 50, operatingHours: "24 Hours", services: ["OPD", "IPD", "Surgery", "Maternity", "Lab"], accessibilityScore: 55 },
  { id: "hf11", name: "Community Pharmacy Palghar", type: "pharmacy", lat: 19.698, lng: 72.765, address: "Market Area, Palghar", district: "Palghar", state: "Maharashtra", pinCode: "401404", contactNumber: "9876500001", operatingHours: "8 AM – 9 PM", services: ["Generic Medicines", "OTC Drugs", "BP/Sugar Monitoring"], accessibilityScore: 90 },
  { id: "hf12", name: "Jan Aushadhi Kendra Barmer", type: "pharmacy", lat: 25.750, lng: 71.395, address: "Near Bus Stand, Barmer", district: "Barmer", state: "Rajasthan", pinCode: "344001", contactNumber: "9876500002", operatingHours: "9 AM – 7 PM", services: ["Generic Medicines", "Government Schemes"], accessibilityScore: 62 },
  { id: "hf13", name: "District Hospital Gadchiroli", type: "district_hospital", lat: 20.098, lng: 80.001, address: "Hospital Road, Gadchiroli", district: "Gadchiroli", state: "Maharashtra", pinCode: "442605", doctors: 8, beds: 80, operatingHours: "24 Hours", services: ["Emergency", "Surgery", "ICU", "Pharmacy"], accessibilityScore: 48 },
  { id: "hf14", name: "PHC Dhorimanna", type: "phc", lat: 25.392, lng: 71.951, address: "Main Road, Dhorimanna Village", district: "Barmer", state: "Rajasthan", pinCode: "344035", doctors: 1, beds: 4, operatingHours: "8 AM – 2 PM", services: ["OPD", "Vaccination", "Basic Lab"], accessibilityScore: 22 },
  { id: "hf15", name: "PHC Jawhar", type: "phc", lat: 19.905, lng: 73.222, address: "Jawahar Town", district: "Palghar", state: "Maharashtra", pinCode: "401302", doctors: 2, beds: 6, operatingHours: "8 AM – 4 PM (Mon–Sat)", services: ["OPD", "Maternity", "Vaccination"], accessibilityScore: 50 },
  { id: "hf16", name: "Tribal CHC Etapalli", type: "chc", lat: 19.250, lng: 80.450, address: "Etapalli Town", district: "Gadchiroli", state: "Maharashtra", pinCode: "442702", doctors: 3, beds: 20, operatingHours: "24 Hours", services: ["OPD", "IPD", "Maternity", "Vaccination"], accessibilityScore: 20 },
  { id: "hf17", name: "PHC Ramsar", type: "phc", lat: 25.847, lng: 71.022, address: "Ramsar Village", district: "Barmer", state: "Rajasthan", pinCode: "344001", doctors: 1, beds: 2, operatingHours: "9 AM – 1 PM", services: ["OPD", "Vaccination"], accessibilityScore: 18 },
  { id: "hf18", name: "Seva NGO Health Camp — Nandurbar", type: "ngo_camp", lat: 21.370, lng: 74.245, address: "Gram Panchayat Bhavan, Nandurbar", district: "Nandurbar", state: "Maharashtra", pinCode: "425412", services: ["OPD", "Medicines", "Vaccination", "Nutrition"], accessibilityScore: 75 },
  { id: "hf19", name: "Akash Medical Store", type: "pharmacy", lat: 20.103, lng: 80.005, address: "Main Market, Gadchiroli", district: "Gadchiroli", state: "Maharashtra", pinCode: "442605", contactNumber: "9876500003", operatingHours: "9 AM – 9 PM", services: ["Prescription Medicines", "OTC", "BP Monitor"], accessibilityScore: 70 },
  { id: "hf20", name: "Sub-Centre Kasa", type: "sub_centre", lat: 19.817, lng: 73.062, address: "Kasa Village, Palghar", district: "Palghar", state: "Maharashtra", pinCode: "401405", services: ["ANM Visit", "Vaccination", "Ante-natal Care"], accessibilityScore: 45 },
];

// ============================
// HEALTH CAMPS
// ============================
export const MOCK_HEALTH_CAMPS: HealthCamp[] = [
  { id: "hc1", name: "Community Health Camp — Palghar", ngoId: "ngo1", ngoName: "Seva Health NGO", location: "Gram Panchayat Ground", village: "Palghar", district: "Palghar", state: "Maharashtra", date: "2026-09-28", startTime: "09:00 AM", endTime: "04:00 PM", services: ["General Consultation", "Medicine Distribution", "Vaccination", "Health Awareness", "Blood Sugar Screening"], availableDoctors: 4, medicineStock: ["Paracetamol", "ORS", "Iron Folic Acid", "Vitamin B12"], expectedBeneficiaries: 200, status: "upcoming", registeredBeneficiaries: 87 },
  { id: "hc2", name: "Maternal & Child Health Camp — Akkalkuwa", ngoId: "ngo1", ngoName: "Seva Health NGO", location: "Primary School Ground", village: "Akkalkuwa", district: "Nandurbar", state: "Maharashtra", date: "2026-09-20", startTime: "09:00 AM", endTime: "03:00 PM", services: ["ANC Check-up", "Child Immunisation", "Nutrition Counselling", "Iron/Folic Acid Distribution"], availableDoctors: 3, medicineStock: ["Iron Folic Acid", "Vitamin B12", "ORS"], expectedBeneficiaries: 150, status: "upcoming", registeredBeneficiaries: 62 },
  { id: "hc3", name: "Malaria Awareness Camp — Barmer", ngoId: "ngo2", ngoName: "Grameen Swasthya NGO", location: "Village Panchayat", village: "Dhorimanna", district: "Barmer", state: "Rajasthan", date: "2026-09-15", startTime: "10:00 AM", endTime: "02:00 PM", services: ["Malaria Testing (RDT)", "Chloroquine Distribution", "LLIN Distribution", "Awareness Session"], availableDoctors: 2, medicineStock: ["Chloroquine", "Paracetamol"], expectedBeneficiaries: 100, status: "upcoming", registeredBeneficiaries: 35 },
  { id: "hc4", name: "General Health Camp — Gadchiroli", ngoId: "ngo3", ngoName: "Tribal Health NGO", location: "Community Hall", village: "Etapalli", district: "Gadchiroli", state: "Maharashtra", date: "2026-09-05", startTime: "09:00 AM", endTime: "05:00 PM", services: ["General Consultation", "Medicines", "Lab Tests", "Referral"], availableDoctors: 5, medicineStock: ["Paracetamol", "ORS", "Antibiotics"], expectedBeneficiaries: 180, status: "completed", registeredBeneficiaries: 163 },
  { id: "hc5", name: "Eye Camp — Dahod", ngoId: "ngo4", ngoName: "Vision India NGO", location: "Taluka School", village: "Limkheda", district: "Dahod", state: "Gujarat", date: "2026-10-05", startTime: "09:00 AM", endTime: "04:00 PM", services: ["Eye Check-up", "Spectacle Distribution", "Cataract Screening", "Referral"], availableDoctors: 3, medicineStock: ["Eye Drops", "Vitamins"], expectedBeneficiaries: 120, status: "upcoming", registeredBeneficiaries: 28 },
  { id: "hc6", name: "Diabetes & BP Screening — Nashik", ngoId: "ngo1", ngoName: "Seva Health NGO", location: "Gram Panchayat Hall", village: "Surgana", district: "Nashik", state: "Maharashtra", date: "2026-10-12", startTime: "10:00 AM", endTime: "03:00 PM", services: ["Blood Sugar Test", "BP Monitoring", "Medication Guidance", "Diet Counselling"], availableDoctors: 2, medicineStock: ["Metformin", "Amlodipine", "Enalapril"], expectedBeneficiaries: 80, status: "upcoming", registeredBeneficiaries: 12 },
  { id: "hc7", name: "Vaccination Drive — Palghar", ngoId: "ngo1", ngoName: "Seva Health NGO", location: "PHC Palghar", village: "Palghar", district: "Palghar", state: "Maharashtra", date: "2026-09-01", startTime: "09:00 AM", endTime: "01:00 PM", services: ["DPT", "MMR", "Polio", "Hepatitis B", "Tetanus Toxoid"], availableDoctors: 2, medicineStock: ["Vaccines"], expectedBeneficiaries: 60, status: "completed", registeredBeneficiaries: 54 },
  { id: "hc8", name: "TB Awareness & Testing Camp — Koraput", ngoId: "ngo5", ngoName: "Odisha Health Collective", location: "Block Office Ground", village: "Jeypore", district: "Koraput", state: "Odisha", date: "2026-09-22", startTime: "09:00 AM", endTime: "03:00 PM", services: ["Sputum Test", "Awareness", "DOTS Initiation", "Referral"], availableDoctors: 3, medicineStock: ["Anti-TB Medicines"], expectedBeneficiaries: 90, status: "upcoming", registeredBeneficiaries: 18 },
];

// ============================
// NGOs
// ============================
export const MOCK_NGOS: NGO[] = [
  { id: "ngo1", name: "Seva Health NGO", regNumber: "MAH/2015/0041", focusArea: ["Primary Healthcare", "Maternal Health", "Nutrition"], state: "Maharashtra", district: "Palghar", address: "Sector 5, Palghar", contact: "9234567890", email: "info@sevahealth.org", fieldWorkers: 18, activeBeneficiaries: 1240, status: "active" },
  { id: "ngo2", name: "Grameen Swasthya NGO", regNumber: "RAJ/2017/0088", focusArea: ["Malaria Control", "Nutrition", "Water & Sanitation"], state: "Rajasthan", district: "Barmer", address: "Near Collectorate, Barmer", contact: "9345678901", email: "info@grameenswasthya.org", fieldWorkers: 12, activeBeneficiaries: 890, status: "active" },
  { id: "ngo3", name: "Tribal Health NGO", regNumber: "MAH/2013/0022", focusArea: ["Tribal Health", "Malaria", "Sickle Cell Disease"], state: "Maharashtra", district: "Gadchiroli", address: "Gadchiroli Town", contact: "9456789012", email: "info@tribalhealth.org", fieldWorkers: 14, activeBeneficiaries: 760, status: "active" },
  { id: "ngo4", name: "Vision India NGO", regNumber: "GUJ/2019/0055", focusArea: ["Eye Care", "Blindness Prevention", "Community Health"], state: "Gujarat", district: "Dahod", address: "Dahod Market Road", contact: "9567890123", email: "info@visionindia.org", fieldWorkers: 8, activeBeneficiaries: 420, status: "active" },
  { id: "ngo5", name: "Odisha Health Collective", regNumber: "ODI/2016/0033", focusArea: ["TB Control", "Malaria", "Child Health"], state: "Odisha", district: "Koraput", address: "Koraput Town", contact: "9678901234", email: "info@odishahealth.org", fieldWorkers: 10, activeBeneficiaries: 610, status: "active" },
];

// ============================
// SYNC RECORDS (for offline demo)
// ============================
export const MOCK_SYNC_RECORDS: SyncRecord[] = [
  { id: "sr1", type: "beneficiary", data: { name: "Rahul Gond", age: 19, village: "Etapalli" }, createdOfflineAt: "2026-09-08T08:00:00", status: "pending" },
  { id: "sr2", type: "case", data: { beneficiaryName: "Rahul Gond", symptoms: ["fever", "malaria-like symptoms"] }, createdOfflineAt: "2026-09-08T08:05:00", status: "pending" },
  { id: "sr3", type: "referral", data: { beneficiaryName: "Rahul Gond", priority: "high", facility: "CHC Gadchiroli" }, createdOfflineAt: "2026-09-08T08:30:00", status: "pending" },
  { id: "sr4", type: "appointment", data: { beneficiaryName: "Rahul Gond", date: "2026-09-09" }, createdOfflineAt: "2026-09-08T08:35:00", status: "pending" },
  { id: "sr5", type: "beneficiary", data: { name: "New Patient X", age: 35, village: "Safale" }, createdOfflineAt: "2026-09-08T07:00:00", status: "conflict", conflictData: { name: "New Patient X (updated)", age: 35, village: "Safale" } },
];

// ============================
// AUDIT LOGS
// ============================
export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: "al1", timestamp: "2026-09-08T09:42:00", userId: "u2", userName: "Rajesh Kumar", userRole: "field_worker", action: "Created Beneficiary", resource: "Beneficiary", resourceId: "b12", status: "success", details: "Registered new beneficiary: Rahul Gond, Etapalli, Gadchiroli" },
  { id: "al2", timestamp: "2026-09-08T09:37:00", userId: "u5", userName: "Suresh Mehta", userRole: "pharmacy", action: "Updated Inventory", resource: "Inventory", resourceId: "i1", status: "success", details: "Updated Paracetamol 500mg stock: +50 units" },
  { id: "al3", timestamp: "2026-09-08T09:20:00", userId: "u4", userName: "Dr. Vikram Singh", userRole: "doctor", action: "Accepted Referral", resource: "Referral", resourceId: "r3", status: "success", details: "Accepted referral for Suresh Rathod — High priority case" },
  { id: "al4", timestamp: "2026-09-08T08:55:00", userId: "u3", userName: "Priya Sharma", userRole: "ngo_admin", action: "Created Health Camp", resource: "HealthCamp", resourceId: "hc1", status: "success", details: "Scheduled Community Health Camp for 28 Sep 2026 at Palghar" },
  { id: "al5", timestamp: "2026-09-08T08:30:00", userId: "u2", userName: "Rajesh Kumar", userRole: "field_worker", action: "Created Referral", resource: "Referral", resourceId: "r8", status: "success", details: "Referred Rahul Gond to CHC Gadchiroli — High priority" },
  { id: "al6", timestamp: "2026-09-08T08:10:00", userId: "u2", userName: "Rajesh Kumar", userRole: "field_worker", action: "Sync Completed", resource: "SyncQueue", status: "success", details: "8 offline records synchronized successfully" },
  { id: "al7", timestamp: "2026-09-08T07:50:00", userId: "u4", userName: "Dr. Vikram Singh", userRole: "doctor", action: "Scheduled Follow-up", resource: "Appointment", resourceId: "ap1", status: "success", details: "Scheduled follow-up for Meena Patil on 9 Sep 2026" },
  { id: "al8", timestamp: "2026-09-08T07:30:00", userId: "u5", userName: "Suresh Mehta", userRole: "pharmacy", action: "Marked Out of Stock", resource: "Inventory", resourceId: "i4", status: "success", details: "Cotrimoxazole 480mg marked as out of stock" },
  { id: "al9", timestamp: "2026-09-08T07:00:00", userId: "u1", userName: "Meena Patil", userRole: "beneficiary", action: "Login", resource: "Session", status: "success", details: "User logged in from Palghar, Maharashtra" },
  { id: "al10", timestamp: "2026-09-07T18:00:00", userId: "u7", userName: "Sunita Yadav", userRole: "field_worker", action: "Offline Sync Attempt", resource: "SyncQueue", status: "failure", details: "Sync failed — No network connectivity" },
  { id: "al11", timestamp: "2026-09-07T16:00:00", userId: "u3", userName: "Priya Sharma", userRole: "ngo_admin", action: "Updated Inventory", resource: "Inventory", resourceId: "i6", status: "success", details: "Received 200 Iron Folic Acid tablets from supply" },
  { id: "al12", timestamp: "2026-09-07T14:00:00", userId: "u6", userName: "Anita Desai", userRole: "admin", action: "Deactivated User", resource: "User", status: "success", details: "Deactivated test account — cleanup" },
  { id: "al13", timestamp: "2026-09-07T12:00:00", userId: "u8", userName: "Raju Pawar", userRole: "field_worker", action: "Created Case", resource: "HealthCase", resourceId: "c6", status: "success", details: "New case for Asha Shinde — high severity" },
  { id: "al14", timestamp: "2026-09-07T10:00:00", userId: "u9", userName: "Dr. Rekha Nair", userRole: "doctor", action: "Accepted Referral", resource: "Referral", resourceId: "r4", status: "success", details: "Accepted referral for Asha Shinde" },
  { id: "al15", timestamp: "2026-09-07T08:00:00", userId: "u6", userName: "Anita Desai", userRole: "admin", action: "Added Organization", resource: "NGO", resourceId: "ngo5", status: "success", details: "Added Odisha Health Collective to platform" },
];

// ============================
// ACCESSIBILITY ZONES
// ============================
export const MOCK_ACCESSIBILITY_ZONES: AccessibilityZone[] = [
  { id: "az1", name: "Palghar Central", district: "Palghar", state: "Maharashtra", lat: 19.698, lng: 72.769, population: 24500, facilities: 6, nearestFacilityKm: 2.1, travelTimeMin: 12, accessibilityScore: 72, priority: "low" },
  { id: "az2", name: "Jawahar Block", district: "Palghar", state: "Maharashtra", lat: 19.905, lng: 73.222, population: 18200, facilities: 3, nearestFacilityKm: 8.5, travelTimeMin: 45, accessibilityScore: 48, priority: "medium" },
  { id: "az3", name: "Talasari Remote Zone", district: "Palghar", state: "Maharashtra", lat: 19.985, lng: 72.957, population: 11800, facilities: 1, nearestFacilityKm: 14.2, travelTimeMin: 68, accessibilityScore: 25, priority: "high" },
  { id: "az4", name: "Nandurbar Town", district: "Nandurbar", state: "Maharashtra", lat: 21.362, lng: 74.240, population: 31200, facilities: 5, nearestFacilityKm: 1.8, travelTimeMin: 8, accessibilityScore: 68, priority: "low" },
  { id: "az5", name: "Akkalkuwa Tribal", district: "Nandurbar", state: "Maharashtra", lat: 21.550, lng: 74.020, population: 14600, facilities: 2, nearestFacilityKm: 9.3, travelTimeMin: 52, accessibilityScore: 38, priority: "high" },
  { id: "az6", name: "Gadchiroli Urban", district: "Gadchiroli", state: "Maharashtra", lat: 20.100, lng: 80.000, population: 22400, facilities: 4, nearestFacilityKm: 3.2, travelTimeMin: 18, accessibilityScore: 55, priority: "medium" },
  { id: "az7", name: "Etapalli Deep Forest", district: "Gadchiroli", state: "Maharashtra", lat: 19.250, lng: 80.450, population: 8900, facilities: 1, nearestFacilityKm: 22.5, travelTimeMin: 95, accessibilityScore: 15, priority: "high" },
  { id: "az8", name: "Barmer City", district: "Barmer", state: "Rajasthan", lat: 25.752, lng: 71.393, population: 45600, facilities: 7, nearestFacilityKm: 1.5, travelTimeMin: 10, accessibilityScore: 62, priority: "low" },
  { id: "az9", name: "Dhorimanna Remote", district: "Barmer", state: "Rajasthan", lat: 25.389, lng: 71.956, population: 18420, facilities: 1, nearestFacilityKm: 14.7, travelTimeMin: 68, accessibilityScore: 22, priority: "high" },
  { id: "az10", name: "Jaisalmer Sam Zone", district: "Jaisalmer", state: "Rajasthan", lat: 26.910, lng: 70.918, population: 6200, facilities: 1, nearestFacilityKm: 32.0, travelTimeMin: 120, accessibilityScore: 10, priority: "high" },
  { id: "az11", name: "Banaskantha Plains", district: "Banaskantha", state: "Gujarat", lat: 24.170, lng: 72.420, population: 28300, facilities: 4, nearestFacilityKm: 5.2, travelTimeMin: 28, accessibilityScore: 58, priority: "medium" },
  { id: "az12", name: "Koraput Town", district: "Koraput", state: "Odisha", lat: 18.815, lng: 82.711, population: 19800, facilities: 3, nearestFacilityKm: 4.8, travelTimeMin: 25, accessibilityScore: 50, priority: "medium" },
];

// Helper: get today's date string
export const TODAY = new Date().toISOString().split("T")[0];
