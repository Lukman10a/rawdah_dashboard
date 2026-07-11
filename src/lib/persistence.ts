import {
  staff as initialStaff,
  teachers as initialTeachers,
  students as initialStudents,
  parents as initialParents,
  notifications as initialNotifications,
} from "./mock-data";
import type { StaffMember, Teacher, Student, Parent } from "./mock-data";

export type AdmissionRequest = {
  id: string;
  name: string;
  grade: string;
  program: "Islamic" | "Western" | "Dual";
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  appliedDate: string;
  status: "Pending" | "Approved" | "Declined";
};

const initialAdmissions: AdmissionRequest[] = [
  {
    id: "AD-011",
    name: "Yunus Al-Hassan",
    grade: "Grade 3",
    program: "Dual",
    guardianName: "Mrs. Zainab H.",
    guardianEmail: "zainab.h@example.com",
    guardianPhone: "+1 555 0411",
    appliedDate: "2026-07-09",
    status: "Pending",
  },
  {
    id: "AD-012",
    name: "Sumayyah Malik",
    grade: "KG 1",
    program: "Islamic",
    guardianName: "Mr. Malik A.",
    guardianEmail: "malik.a@example.com",
    guardianPhone: "+1 555 0412",
    appliedDate: "2026-07-10",
    status: "Pending",
  },
  {
    id: "AD-013",
    name: "Bilal Yusuf",
    grade: "Grade 7",
    program: "Western",
    guardianName: "Mrs. Amina Y.",
    guardianEmail: "amina.y@example.com",
    guardianPhone: "+1 555 0413",
    appliedDate: "2026-07-11",
    status: "Pending",
  },
];

const isClient = typeof window !== "undefined";

function getStored<T>(key: string, defaultValue: T): T {
  if (!isClient) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  if (!isClient) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
}

// Staff CRUD
export function getStoredStaff(): StaffMember[] {
  return getStored("rawdah_staff", initialStaff);
}
export function saveStaff(list: StaffMember[]): void {
  setStored("rawdah_staff", list);
}

// Teachers CRUD
export function getStoredTeachers(): Teacher[] {
  return getStored("rawdah_teachers", initialTeachers);
}
export function saveTeachers(list: Teacher[]): void {
  setStored("rawdah_teachers", list);
}

// Students CRUD
export function getStoredStudents(): Student[] {
  return getStored("rawdah_students", initialStudents);
}
export function saveStudents(list: Student[]): void {
  setStored("rawdah_students", list);
}

// Parents CRUD
export function getStoredParents(): Parent[] {
  return getStored("rawdah_parents", initialParents);
}
export function saveParents(list: Parent[]): void {
  setStored("rawdah_parents", list);
}

// Notifications CRUD
export function getStoredNotifications() {
  return getStored("rawdah_notifications", initialNotifications);
}
export function saveNotifications(list: any[]): void {
  setStored("rawdah_notifications", list);
}

// Admissions CRUD
export function getStoredAdmissions(): AdmissionRequest[] {
  return getStored("rawdah_admissions", initialAdmissions);
}
export function saveAdmissions(list: AdmissionRequest[]): void {
  setStored("rawdah_admissions", list);
}
