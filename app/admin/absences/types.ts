export interface StudentAbsenceSummary {
  studentId: string;
  studentNumber: string;
  fullName: string;
  program: string;
  yearLevel: string | null;
  section: string | null;
  totalAbsences: number;
  excusedCount: number;
  unexcusedCount: number;
  lastAbsenceDate: string | null;
}

export interface AbsenceRecord {
  id: string;
  studentId: string;
  eventName: string;
  eventType: 'Class' | 'Event' | 'Exam' | 'Seminar' | 'Other';
  absenceDate: string;
  status: 'Excused' | 'Unexcused' | 'Pending';
  reason: string | null;
  recordedBy: string | null;
}

export interface StudentOption {
  id: string;
  studentNumber: string;
  fullName: string;
  program: string;
}
