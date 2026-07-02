// Mock data for the Rawdah LMS showcase dashboard.
// All data is fictional — no backend, no persistence.

export type Teacher = {
  id: string;
  name: string;
  title: string;
  specialization: string;
  employmentType: "Hourly" | "Salaried";
  hourlyRate: number;
  hoursLogged: number;
  salaryMonthly?: number;
  attendance: number; // %
  rating: number; // 0-5
  email: string;
  phone: string;
  joined: string;
  status: "Active" | "On Leave" | "Sabbatical";
  avatarSeed: string;
};

export type Student = {
  id: string;
  name: string;
  grade: string;
  program: "Islamic" | "Western" | "Dual";
  guardian: string;
  performance: number; // %
  attendance: number; // %
  behavior: "Excellent" | "Good" | "Needs Focus";
  lastReport: string;
  avatarSeed: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  status: "Active" | "On Leave";
  email: string;
  joined: string;
};

export type Parent = {
  id: string;
  name: string;
  children: string[];
  email: string;
  phone: string;
  lastSeen: string;
  satisfaction: number;
};

export type AttendanceRow = {
  date: string;
  present: number;
  late: number;
  absent: number;
};

export type LessonAudit = {
  id: string;
  grade: string;
  subject: string;
  teacher: string;
  alignment: number;
  gaps: string[];
  status: "Aligned" | "Review" | "Off-track";
};

export const teachers: Teacher[] = [
  { id: "T-001", name: "Dr. Omar Al-Faruq", title: "Ustadh", specialization: "Qur'anic Sciences", employmentType: "Hourly", hourlyRate: 55, hoursLogged: 120, attendance: 99, rating: 4.9, email: "omar.faruq@rawdah.edu", phone: "+1 555 0142", joined: "2019-08-14", status: "Active", avatarSeed: "omar" },
  { id: "T-002", name: "Ustadha Aisha Malik", title: "Ustadha", specialization: "Islamic Jurisprudence", employmentType: "Hourly", hourlyRate: 48.5, hoursLogged: 104.5, attendance: 97, rating: 4.8, email: "aisha.malik@rawdah.edu", phone: "+1 555 0173", joined: "2020-01-06", status: "Active", avatarSeed: "aisha" },
  { id: "T-003", name: "Sarah Ibrahim", title: "Ms.", specialization: "Advanced Mathematics", employmentType: "Hourly", hourlyRate: 42, hoursLogged: 142, attendance: 96, rating: 4.7, email: "s.ibrahim@rawdah.edu", phone: "+1 555 0194", joined: "2018-09-01", status: "Active", avatarSeed: "sarah" },
  { id: "T-004", name: "Yusuf Mansour", title: "Ustadh", specialization: "Arabic Linguistics", employmentType: "Hourly", hourlyRate: 38, hoursLogged: 90, attendance: 93, rating: 4.5, email: "y.mansour@rawdah.edu", phone: "+1 555 0155", joined: "2021-03-22", status: "Active", avatarSeed: "yusuf" },
  { id: "T-005", name: "Khadijah Khan", title: "Mrs.", specialization: "English Literature", employmentType: "Hourly", hourlyRate: 40, hoursLogged: 110, attendance: 98, rating: 4.8, email: "k.khan@rawdah.edu", phone: "+1 555 0121", joined: "2017-05-19", status: "Active", avatarSeed: "khadijah" },
  { id: "T-006", name: "Ibrahim Zaid", title: "Mr.", specialization: "General Science", employmentType: "Hourly", hourlyRate: 35, hoursLogged: 85.5, attendance: 91, rating: 4.4, email: "i.zaid@rawdah.edu", phone: "+1 555 0188", joined: "2022-08-30", status: "On Leave", avatarSeed: "ibrahim" },
  { id: "T-007", name: "Maryam Idris", title: "Ustadha", specialization: "Tafsir & Hadith", employmentType: "Salaried", hourlyRate: 0, hoursLogged: 0, salaryMonthly: 5200, attendance: 99, rating: 4.9, email: "m.idris@rawdah.edu", phone: "+1 555 0139", joined: "2016-02-11", status: "Active", avatarSeed: "maryam" },
  { id: "T-008", name: "Bilal Ahmed", title: "Mr.", specialization: "Computer Science", employmentType: "Hourly", hourlyRate: 45, hoursLogged: 96, attendance: 95, rating: 4.6, email: "b.ahmed@rawdah.edu", phone: "+1 555 0166", joined: "2020-11-04", status: "Active", avatarSeed: "bilal" },
  { id: "T-009", name: "Fatima Zahra", title: "Ustadha", specialization: "Classical Arabic", employmentType: "Hourly", hourlyRate: 60, hoursLogged: 42, attendance: 100, rating: 5.0, email: "f.zahra@rawdah.edu", phone: "+1 555 0111", joined: "2015-07-17", status: "Active", avatarSeed: "fatima" },
  { id: "T-010", name: "Zainab Nur", title: "Mrs.", specialization: "Early Years Foundation", employmentType: "Salaried", hourlyRate: 0, hoursLogged: 0, salaryMonthly: 4600, attendance: 96, rating: 4.7, email: "z.nur@rawdah.edu", phone: "+1 555 0102", joined: "2019-04-08", status: "Active", avatarSeed: "zainab" },
];

export function computePay(t: Teacher): number {
  if (t.employmentType === "Salaried") return t.salaryMonthly ?? 0;
  return +(t.hourlyRate * t.hoursLogged).toFixed(2);
}

export const staff: StaffMember[] = [
  { id: "S-001", name: "Ustadh Ibrahim Suleiman", role: "Principal", department: "Administration", status: "Active", email: "principal@rawdah.edu", joined: "2014-08-01" },
  { id: "S-002", name: "Hajar Yusuf", role: "Vice Principal", department: "Administration", status: "Active", email: "h.yusuf@rawdah.edu", joined: "2016-09-12" },
  { id: "S-003", name: "Amina Bello", role: "Registrar", department: "Admissions", status: "Active", email: "registrar@rawdah.edu", joined: "2018-01-15" },
  { id: "S-004", name: "Musa Danladi", role: "Finance Officer", department: "Finance", status: "Active", email: "finance@rawdah.edu", joined: "2019-03-08" },
  { id: "S-005", name: "Ruqayyah Bello", role: "Counsellor", department: "Student Welfare", status: "Active", email: "welfare@rawdah.edu", joined: "2020-06-22" },
  { id: "S-006", name: "Abdulrahman Musa", role: "IT Administrator", department: "Technology", status: "Active", email: "it@rawdah.edu", joined: "2021-02-14" },
  { id: "S-007", name: "Halima Sadiq", role: "Librarian", department: "Academic Support", status: "On Leave", email: "library@rawdah.edu", joined: "2018-10-01" },
  { id: "S-008", name: "Ismail Kabir", role: "Facilities Manager", department: "Operations", status: "Active", email: "facilities@rawdah.edu", joined: "2017-12-03" },
];

export const students: Student[] = [
  { id: "R-1001", name: "Zaid Rahman", grade: "Grade 2", program: "Dual", guardian: "Mrs. Fatima Z.", performance: 92, attendance: 98, behavior: "Excellent", lastReport: "2 days ago", avatarSeed: "zaid" },
  { id: "R-1002", name: "Laila Bakr", grade: "KG 2", program: "Islamic", guardian: "Mr. Khalid R.", performance: 88, attendance: 95, behavior: "Good", lastReport: "5 days ago", avatarSeed: "laila" },
  { id: "R-1003", name: "Yahya Idris", grade: "Grade 5", program: "Dual", guardian: "Mrs. Amina I.", performance: 79, attendance: 91, behavior: "Good", lastReport: "1 day ago", avatarSeed: "yahya" },
  { id: "R-1004", name: "Safiyya Musa", grade: "Grade 4", program: "Western", guardian: "Mr. Musa D.", performance: 95, attendance: 99, behavior: "Excellent", lastReport: "3 days ago", avatarSeed: "safiyya" },
  { id: "R-1005", name: "Hamza Bello", grade: "Grade 7", program: "Islamic", guardian: "Mrs. Hafsa B.", performance: 71, attendance: 86, behavior: "Needs Focus", lastReport: "6 days ago", avatarSeed: "hamza" },
  { id: "R-1006", name: "Maryam Khan", grade: "Grade 1", program: "Dual", guardian: "Dr. Umar K.", performance: 90, attendance: 97, behavior: "Excellent", lastReport: "Yesterday", avatarSeed: "maryam-s" },
  { id: "R-1007", name: "Uthman Adam", grade: "Grade 6", program: "Islamic", guardian: "Mr. Adam A.", performance: 82, attendance: 93, behavior: "Good", lastReport: "4 days ago", avatarSeed: "uthman" },
  { id: "R-1008", name: "Aisha Farid", grade: "Grade 3", program: "Dual", guardian: "Mrs. Zahra F.", performance: 86, attendance: 96, behavior: "Good", lastReport: "Today", avatarSeed: "aishas" },
];

export const parents: Parent[] = [
  { id: "P-501", name: "Mrs. Fatima Z.", children: ["Zaid Rahman"], email: "fatima.z@example.com", phone: "+1 555 0301", lastSeen: "2h ago", satisfaction: 96 },
  { id: "P-502", name: "Mr. Khalid R.", children: ["Laila Bakr"], email: "khalid.r@example.com", phone: "+1 555 0322", lastSeen: "Yesterday", satisfaction: 92 },
  { id: "P-503", name: "Mrs. Amina I.", children: ["Yahya Idris"], email: "amina.i@example.com", phone: "+1 555 0344", lastSeen: "3d ago", satisfaction: 88 },
  { id: "P-504", name: "Dr. Umar K.", children: ["Maryam Khan"], email: "umar.k@example.com", phone: "+1 555 0355", lastSeen: "1h ago", satisfaction: 98 },
  { id: "P-505", name: "Mrs. Hafsa B.", children: ["Hamza Bello"], email: "hafsa.b@example.com", phone: "+1 555 0388", lastSeen: "5d ago", satisfaction: 79 },
];

export const attendance30d: AttendanceRow[] = Array.from({ length: 14 }, (_, i) => {
  const day = 14 - i;
  const present = 1140 + Math.round(Math.sin(i / 2) * 40 + Math.random() * 30);
  const late = 20 + Math.round(Math.random() * 12);
  const absent = 1248 - present - late;
  return { date: `Day ${day}`, present, late, absent };
}).reverse();

export const enrollmentSeries = [
  { month: "Muharram", enrollment: 980, performance: 84 },
  { month: "Safar", enrollment: 1020, performance: 86 },
  { month: "Rabi' I", enrollment: 1070, performance: 87 },
  { month: "Rabi' II", enrollment: 1120, performance: 89 },
  { month: "Jumada I", enrollment: 1190, performance: 90 },
  { month: "Jumada II", enrollment: 1248, performance: 92 },
];

export const payrollBreakdown = [
  { name: "Qur'anic Sciences", value: 12400 },
  { name: "Arabic & Fiqh", value: 9800 },
  { name: "Mathematics & Science", value: 11200 },
  { name: "English & Humanities", value: 6300 },
  { name: "Early Years", value: 3150 },
];

export const lessonAudits: LessonAudit[] = [
  { id: "LA-01", grade: "KG 1", subject: "Mathematics Foundation W4", teacher: "Sarah Ibrahim", alignment: 98, gaps: [], status: "Aligned" },
  { id: "LA-02", grade: "Grade 2", subject: "Qur'an Tajweed W3", teacher: "Dr. Omar Al-Faruq", alignment: 92, gaps: ["Add revision block"], status: "Aligned" },
  { id: "LA-03", grade: "Grade 4", subject: "Fiqh Essentials W2", teacher: "Ustadha Aisha Malik", alignment: 74, gaps: ["Missing assessment", "Objective mismatch"], status: "Review" },
  { id: "LA-04", grade: "Grade 7", subject: "Tajweed Advanced W5", teacher: "Ustadha Fatima Zahra", alignment: 61, gaps: ["Two learning outcomes not covered", "No differentiation"], status: "Off-track" },
  { id: "LA-05", grade: "Grade 5", subject: "English Literature W3", teacher: "Khadijah Khan", alignment: 95, gaps: [], status: "Aligned" },
  { id: "LA-06", grade: "Grade 6", subject: "General Science W1", teacher: "Ibrahim Zaid", alignment: 82, gaps: ["Practical missing"], status: "Aligned" },
];

export const aiInsights = [
  { id: "AI-01", kind: "Attendance Pattern", severity: "Warning", title: "Recurring Tuesday absences — Grade 4 Fiqh", detail: "Detected 6 consecutive Tuesdays with >12% absence. Weather and prayer schedule cross-referenced.", action: "View class" },
  { id: "AI-02", kind: "Leave Pattern", severity: "Info", title: "3 staff trending toward burnout", detail: "Aisha Malik, Ibrahim Zaid, Yusuf Mansour show >20% overtime this month.", action: "Review workload" },
  { id: "AI-03", kind: "Curriculum", severity: "Critical", title: "Grade 7 Tajweed 2 outcomes uncovered", detail: "Two learning outcomes from national standard are not covered in this term's plan.", action: "Open auditor" },
  { id: "AI-04", kind: "Payroll Forecast", severity: "Info", title: "Ramadan schedule +$2.4k projected", detail: "Reduced daytime blocks and evening tutorial hours increase hourly overhead.", action: "Simulate" },
  { id: "AI-05", kind: "Student Risk", severity: "Warning", title: "Hamza Bello — performance dip", detail: "Performance dropped 9pts over 4 weeks with rising late arrivals.", action: "Notify parent" },
];

export const parentUpdates = [
  { child: "Zaid Rahman", note: "Excellent Tajweed recitation this week — flagged for a star award.", when: "Today", type: "Praise" },
  { child: "Laila Bakr", note: "Reading fluency improved 12% since last audit.", when: "Yesterday", type: "Progress" },
  { child: "Hamza Bello", note: "Requesting a parent-teacher call to align on focus areas.", when: "2 days ago", type: "Action" },
];

export const notifications = [
  { title: "Payroll cutoff in 3 days", desc: "Monthly disbursement queued for review.", when: "1h" },
  { title: "New enrolment inquiry", desc: "Grade 3 — Dual programme.", when: "3h" },
  { title: "AI audit complete", desc: "6 lesson plans reviewed, 1 critical flag.", when: "Today" },
];
