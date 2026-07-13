'use client';

import React, { useActionState } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { IdCard, Check, ChevronDown } from 'lucide-react';
import styles from './page.module.css';
import { completeStudentProfile, type CompleteProfileState } from './actions';

const initialState: CompleteProfileState = {};

const PROGRAMS = [
  'BS Development Communication',
  'AB Political Science',
  'BS Psychology',
];

const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

export default function CompleteProfileModal({
  defaultFullName,
  email,
}: {
  defaultFullName: string;
  email: string;
}) {
  const [state, formAction, isPending] = useActionState(completeStudentProfile, initialState);

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="complete-profile-title">
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <div className={styles.modalIcon}>
            <IdCard size={18} />
          </div>
          <h2 id="complete-profile-title" className={styles.modalTitle}>Complete your student profile</h2>
          <p className={styles.modalSubtitle}>
            A few details before you can access the rest of the portal.
          </p>
        </div>

        <form action={formAction} className={styles.modalForm}>
          <div className={styles.field}>
            <label htmlFor="student_number" className={styles.label}>Student number</label>
            <input
              id="student_number"
              name="student_number"
              type="text"
              className={styles.input}
              placeholder="e.g. 2026-00123"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="full_name" className={styles.label}>Full name</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              className={styles.input}
              defaultValue={defaultFullName}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Program / Course</label>
            <SelectPrimitive.Root name="program" required>
              <SelectPrimitive.Trigger className={styles.selectTrigger}>
                <SelectPrimitive.Value placeholder="Select your program" />
                <SelectPrimitive.Icon asChild>
                  <ChevronDown size={14} className={styles.selectChevron} />
                </SelectPrimitive.Icon>
              </SelectPrimitive.Trigger>
              <SelectPrimitive.Portal>
                <SelectPrimitive.Content className={styles.selectContent} position="popper" sideOffset={6}>
                  <SelectPrimitive.Viewport className={styles.selectViewport}>
                    {PROGRAMS.map((program) => (
                      <SelectPrimitive.Item key={program} value={program} className={styles.selectItem}>
                        <span className={styles.selectItemIndicator}>
                          <SelectPrimitive.ItemIndicator>
                            <Check size={13} />
                          </SelectPrimitive.ItemIndicator>
                        </span>
                        <SelectPrimitive.ItemText>{program}</SelectPrimitive.ItemText>
                      </SelectPrimitive.Item>
                    ))}
                  </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Year level</label>
              <SelectPrimitive.Root name="year_level">
                <SelectPrimitive.Trigger className={styles.selectTrigger}>
                  <SelectPrimitive.Value placeholder="Select" />
                  <SelectPrimitive.Icon asChild>
                    <ChevronDown size={14} className={styles.selectChevron} />
                  </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>
                <SelectPrimitive.Portal>
                  <SelectPrimitive.Content className={styles.selectContent} position="popper" sideOffset={6}>
                    <SelectPrimitive.Viewport className={styles.selectViewport}>
                      {YEAR_LEVELS.map((year) => (
                        <SelectPrimitive.Item key={year} value={year} className={styles.selectItem}>
                          <span className={styles.selectItemIndicator}>
                            <SelectPrimitive.ItemIndicator>
                              <Check size={13} />
                            </SelectPrimitive.ItemIndicator>
                          </span>
                          <SelectPrimitive.ItemText>{year}</SelectPrimitive.ItemText>
                        </SelectPrimitive.Item>
                      ))}
                    </SelectPrimitive.Viewport>
                  </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
              </SelectPrimitive.Root>
            </div>

            <div className={styles.field}>
              <label htmlFor="section" className={styles.label}>Section</label>
              <input
                id="section"
                name="section"
                type="text"
                className={styles.input}
                placeholder="e.g. BSIT-3A"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>School email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              disabled
            />
          </div>

          {state.error && (
            <p className={styles.errorMessage} role="alert">{state.error}</p>
          )}

          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending ? 'Saving…' : 'Save and continue'}
          </button>
        </form>
      </div>
    </div>
  );
}