'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  CalendarX,
  Receipt,
  ShieldAlert,
  LogOut,
  Landmark,
  Smartphone,
  CreditCard,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  FileText,
} from 'lucide-react';
import styles from './page.module.css';
import CompleteProfileModal from './CompleteProfileModal';
import { createClient } from '@/lib/supabase/client';

type Student = {
  id: string;
  student_number: string;
  full_name: string;
  program: string;
  year_level: string | null;
  section: string | null;
  email: string | null;
} | null;

type PaymentMethod = {
  id: string;
  method_code: string;
  method_type: 'GCash' | 'PayMaya' | 'Bank Transfer' | 'Other';
  account_name: string;
  account_number: string;
  qr_image_url: string | null;
};

type Announcement = {
  id: string;
  title: string;
  content: string;
  priority: string;
  created_at: string;
};

type Props = {
  user: { id: string; email: string; name: string };
  student: Student;
  needsProfile: boolean;
  paymentMethods: PaymentMethod[];
  announcements: Announcement[];
};

type AttendanceRow = {
  id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  attendance: 'Present' | 'Absent';
};

const MOCK_PRESENT = { count: 26, total: 30 };
const MOCK_ABSENCES = { count: 4, total: 30 };
const MOCK_BALANCE = { amount: 2350, dueDate: 'Jul 30, 2026' };
const MOCK_SANCTION = {
  name: 'Warning Notice',
  description: 'Issued after 3 unexcused absences. Another absence may result in further action.',
};

const MOCK_ATTENDANCE: AttendanceRow[] = [
  { id: '1', event_name: 'Communication Theory', event_type: 'Class', event_date: '2026-07-14', attendance: 'Present' },
  { id: '2', event_name: 'Philippine Government', event_type: 'Class', event_date: '2026-07-14', attendance: 'Present' },
  { id: '3', event_name: 'Midterm Examination', event_type: 'Exam', event_date: '2026-07-11', attendance: 'Absent' },
  { id: '4', event_name: 'Abnormal Psychology', event_type: 'Class', event_date: '2026-07-10', attendance: 'Present' },
  { id: '5', event_name: 'Freshmen Orientation Seminar', event_type: 'Seminar', event_date: '2026-07-08', attendance: 'Absent' },
  { id: '6', event_name: 'Environmental Science', event_type: 'Class', event_date: '2026-07-07', attendance: 'Present' },
];

function formatCurrency(amount: number) {
  return `₱${amount.toLocaleString('en-PH')}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatAccountNumber(accountNumber: string) {
  return accountNumber.replace(/(.{4})/g, '$1 ').trim();
}

function maskAccountNumber(accountNumber: string) {
  const digits = accountNumber.replace(/\s+/g, '');
  const last4 = digits.slice(-4);
  const maskedCount = Math.max(digits.length - 4, 0);
  const masked = '•'.repeat(maskedCount) + last4;
  return masked.replace(/(.{4})/g, '$1 ').trim();
}

function paymentIcon(methodType: PaymentMethod['method_type']) {
  if (methodType === 'Bank Transfer') return Landmark;
  if (methodType === 'Other') return CreditCard;
  return Smartphone;
}

function paymentCardClass(methodType: PaymentMethod['method_type']) {
  if (methodType === 'GCash') return styles.premiumCardGcash;
  if (methodType === 'PayMaya') return styles.premiumCardPaymaya;
  if (methodType === 'Bank Transfer') return styles.premiumCardBank;
  return styles.premiumCardOther;
}

export default function DashboardShell({
  user,
  student,
  needsProfile,
  paymentMethods,
  announcements,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/student-login';
  };

  const presentPercent = Math.round((MOCK_PRESENT.count / MOCK_PRESENT.total) * 100);
  const absencePercent = Math.round((MOCK_ABSENCES.count / MOCK_ABSENCES.total) * 100);
  const recentAnnouncements = announcements;

  const hasMultiplePaymentMethods = paymentMethods.length > 1;
  const activePaymentMethod = paymentMethods[activeIndex] ?? null;
  const ActiveIcon = activePaymentMethod ? paymentIcon(activePaymentMethod.method_type) : CreditCard;

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((i) => (i - 1 + paymentMethods.length) % paymentMethods.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((i) => (i + 1) % paymentMethods.length);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoCircle}></div>
          <span>Student Portal</span>
        </div>
        <div className={styles.headerActions}>
          <Link href="/student/calendar" className={styles.headerIconBtn}>
            <Calendar size={13} /> Calendar
          </Link>
          <Link href="/student/documents" className={styles.headerIconBtn}>
            <FileText size={13} /> Documents
          </Link>
          <button className={styles.signOutBtn} onClick={handleSignOut}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </header>

      <main className={styles.main} aria-hidden={needsProfile}>
        <div className={needsProfile ? styles.blockedContent : undefined}>
          <h1 className={styles.welcome}>
            Welcome{student?.full_name ? `, ${student.full_name.split(' ')[0]}` : ''}
          </h1>

          <div className={styles.grid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <CalendarCheck size={16} />
                <span className={styles.statLabel}>Present</span>
              </div>
              <div className={styles.statValue}>{MOCK_PRESENT.count}</div>
              <div className={styles.statSub}>
                out of {MOCK_PRESENT.total} sessions ({presentPercent}%)
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <CalendarX size={16} />
                <span className={styles.statLabel}>Absences</span>
              </div>
              <div className={styles.statValue}>{MOCK_ABSENCES.count}</div>
              <div className={styles.statSub}>
                out of {MOCK_ABSENCES.total} sessions ({absencePercent}%)
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <Receipt size={16} />
                <span className={styles.statLabel}>Balance</span>
              </div>
              <div className={styles.statValue}>{formatCurrency(MOCK_BALANCE.amount)}</div>
              <div className={styles.statSub}>Due {MOCK_BALANCE.dueDate}</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <ShieldAlert size={16} />
                <span className={styles.statLabel}>Sanction</span>
              </div>
              <div className={styles.sanctionName}>{MOCK_SANCTION.name}</div>
              <div className={styles.statSub}>{MOCK_SANCTION.description}</div>
            </div>
          </div>

          <div className={styles.lowerSection}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <CalendarCheck size={16} />
                <h3>Attendance</h3>
              </div>
              <p className={styles.cardSubtitle}>Your recorded events and attendance status.</p>
              <div className={styles.attendanceTableWrapper}>
                <table className={styles.attendanceTable}>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ATTENDANCE.map((row) => (
                      <tr key={row.id}>
                        <td>{row.event_name}</td>
                        <td>{row.event_type}</td>
                        <td>{formatDate(row.event_date)}</td>
                        <td>
                          <span
                            className={
                              row.attendance === 'Present'
                                ? styles.attendancePresentBadge
                                : styles.attendanceAbsentBadge
                            }
                          >
                            {row.attendance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.paymentCarousel}>
                {activePaymentMethod ? (
                  <div
                    className={`${styles.premiumCard} ${paymentCardClass(activePaymentMethod.method_type)}`}
                    onClick={() => setSelectedMethod(activePaymentMethod)}
                    role="button"
                    tabIndex={0}
                  >
                    <ActiveIcon size={110} className={styles.premiumGhostIcon} />

                    <div className={styles.premiumTopRow}>
                      <div className={styles.premiumBadge}>
                        <ActiveIcon size={16} />
                      </div>
                      <span className={styles.premiumTapHint}>Tap for details</span>
                    </div>

                    <div className={styles.premiumMiddle}>
                      <span className={styles.premiumMethodType}>{activePaymentMethod.method_type}</span>
                      <span className={styles.premiumNumber}>
                        {maskAccountNumber(activePaymentMethod.account_number)}
                      </span>
                    </div>

                    <div className={styles.premiumBottomRow}>
                      <span className={styles.premiumAccountName}>{activePaymentMethod.account_name}</span>
                      {hasMultiplePaymentMethods && (
                        <div className={styles.premiumNav}>
                          <button className={styles.premiumNavBtn} onClick={goPrev} aria-label="Previous payment method">
                            <ChevronLeft size={14} />
                          </button>
                          <button className={styles.premiumNavBtn} onClick={goNext} aria-label="Next payment method">
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={`${styles.premiumCard} ${styles.premiumCardOther}`}>
                    <span className={styles.premiumEmptyState}>No payment method available</span>
                  </div>
                )}

                {hasMultiplePaymentMethods && (
                  <div className={styles.premiumDots}>
                    {paymentMethods.map((method, idx) => (
                      <button
                        key={method.id}
                        className={idx === activeIndex ? styles.premiumDotActive : styles.premiumDot}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex(idx);
                        }}
                        aria-label={`Show ${method.method_type}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.card}>
                <div className={styles.announcementPanelHeader}>
                  <div className={styles.cardHeader}>
                    <span className={styles.statLabel}>Announcements</span>
                  </div>
                  <Link href="/student/announcements" className={styles.viewAllLink}>
                    View all <ArrowRight size={12} />
                  </Link>
                </div>
                {recentAnnouncements.length === 0 ? (
                  <p className={styles.emptyState}>No announcements yet.</p>
                ) : (
                  <ul className={styles.miniAnnouncementList}>
                    {recentAnnouncements.map((item) => (
                      <li key={item.id} className={styles.miniAnnouncementItem}>
                        <div className={styles.miniAnnouncementTopRow}>
                          <span className={styles.miniAnnouncementTag}>{item.priority}</span>
                          <span className={styles.miniAnnouncementDate}>{formatDate(item.created_at)}</span>
                        </div>
                        <span className={styles.miniAnnouncementTitle}>{item.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedMethod && (
        <div className={styles.paymentModalOverlay} onClick={() => setSelectedMethod(null)}>
          <div className={styles.paymentModalCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.paymentModalCloseBtn} onClick={() => setSelectedMethod(null)} aria-label="Close">
              <X size={16} />
            </button>
            <div className={styles.paymentModalHeader}>
              <div className={styles.paymentModalIconWrap}>
                {React.createElement(paymentIcon(selectedMethod.method_type), { size: 20 })}
              </div>
              <h2 className={styles.paymentModalTitle}>{selectedMethod.method_type}</h2>
            </div>
            <div className={styles.paymentModalBody}>
              <div className={styles.paymentModalRow}>
                <span className={styles.paymentModalLabel}>Account name</span>
                <span className={styles.paymentModalValue}>{selectedMethod.account_name}</span>
              </div>
              <div className={styles.paymentModalRow}>
                <span className={styles.paymentModalLabel}>Account number</span>
                <span className={styles.paymentModalValue}>
                  {formatAccountNumber(selectedMethod.account_number)}
                </span>
              </div>
              <div className={styles.paymentModalRow}>
                <span className={styles.paymentModalLabel}>Reference code</span>
                <span className={styles.paymentModalValue}>{selectedMethod.method_code}</span>
              </div>
              {selectedMethod.qr_image_url && (
                <img
                  src={selectedMethod.qr_image_url}
                  alt={`${selectedMethod.method_type} QR code`}
                  className={styles.paymentModalQr}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {needsProfile && (
        <CompleteProfileModal
          defaultFullName={student?.full_name || user.name}
          email={user.email}
        />
      )}
    </div>
  );
}