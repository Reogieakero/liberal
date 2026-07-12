"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Scan, 
  FileText, 
  Megaphone, 
  CreditCard, 
  CalendarX, 
  AlertTriangle, 
  CalendarDays 
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Scanners', href: '/admin/scanners', icon: Scan },
    { name: 'Documents', href: '/admin/documents', icon: FileText },
    { name: 'Announcements', href: '/admin/announcement', icon: Megaphone },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Absences', href: '/admin/absences', icon: CalendarX },
    { name: 'Sanctions', href: '/admin/sanctions', icon: AlertTriangle },
    { name: 'Events', href: '/admin/events', icon: CalendarDays },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.navLinks}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <div className={styles.activeIndicator} />
              <div className={styles.iconWrapper}>
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              </div>
              <span className={styles.linkLabel}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}