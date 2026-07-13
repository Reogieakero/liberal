-- ============================================
-- SAMPLE DATA
-- Explicit UUIDs are used so absences can reference the correct student.
-- Safe to run multiple times (ON CONFLICT DO NOTHING on student_number).
-- ============================================

insert into students (id, student_number, full_name, program, year_level, section, email)
values
  ('11111111-1111-1111-1111-111111111101', '2023-00145', 'Maria Santos',        'BS Development Communication', '3rd Year', 'A', 'maria.santos@example.edu'),
  ('11111111-1111-1111-1111-111111111102', '2023-00146', 'Juan Dela Cruz',      'BS Development Communication', '2nd Year', 'B', 'juan.delacruz@example.edu'),
  ('11111111-1111-1111-1111-111111111103', '2022-00098', 'Angelica Reyes',      'AB Political Science',         '4th Year', 'A', 'angelica.reyes@example.edu'),
  ('11111111-1111-1111-1111-111111111104', '2023-00201', 'Mark Villanueva',     'AB Political Science',         '1st Year', 'C', 'mark.villanueva@example.edu'),
  ('11111111-1111-1111-1111-111111111105', '2021-00077', 'Kristine Bautista',   'BS Psychology',                '4th Year', 'A', 'kristine.bautista@example.edu'),
  ('11111111-1111-1111-1111-111111111106', '2023-00212', 'Paolo Mendoza',       'BS Psychology',                '2nd Year', 'B', 'paolo.mendoza@example.edu'),
  ('11111111-1111-1111-1111-111111111107', '2022-00133', 'Samantha Cruz',       'BS Psychology',                '3rd Year', 'A', 'samantha.cruz@example.edu'),
  ('11111111-1111-1111-1111-111111111108', '2023-00250', 'Enzo Ramirez',        'BS Development Communication', '1st Year', 'A', 'enzo.ramirez@example.edu'),
  ('11111111-1111-1111-1111-111111111109', '2020-00045', 'Bea Fernandez',       'AB Political Science',         '4th Year', 'B', 'bea.fernandez@example.edu'),
  ('11111111-1111-1111-1111-111111111110', '2023-00299', 'Miguel Torres',       'BS Development Communication', '2nd Year', 'C', 'miguel.torres@example.edu'),
  ('11111111-1111-1111-1111-111111111111', '2022-00160', 'Nicole Aquino',       'BS Psychology',                '3rd Year', 'C', 'nicole.aquino@example.edu'),
  ('11111111-1111-1111-1111-111111111112', '2023-00310', 'Rafael Gonzales',     'AB Political Science',         '1st Year', 'A', 'rafael.gonzales@example.edu')
on conflict (student_number) do nothing;

-- ============================================
-- Absence events
-- Totals per student (for quick reference):
--   Maria Santos      -> 5 (2 excused, 3 unexcused)  -> HIGH risk
--   Juan Dela Cruz    -> 1 (unexcused)
--   Angelica Reyes    -> 0 (no absences at all)
--   Mark Villanueva   -> 6 (1 excused, 5 unexcused)   -> HIGH risk
--   Kristine Bautista -> 3 (3 excused)                -> MEDIUM risk
--   Paolo Mendoza     -> 2 (1 excused, 1 pending)
--   Samantha Cruz     -> 4 (unexcused)                -> MEDIUM risk
--   Enzo Ramirez      -> 1 (excused)
--   Bea Fernandez     -> 0
--   Miguel Torres     -> 2 (unexcused)
--   Nicole Aquino     -> 7 (mixed)                    -> HIGH risk
--   Rafael Gonzales   -> 1 (pending)
-- ============================================

insert into absences (student_id, event_name, event_type, absence_date, status, reason, recorded_by)
values
  -- Maria Santos (5)
  ('11111111-1111-1111-1111-111111111101', 'COMM 101 - Lecture',        'Class',   '2026-06-02', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111101', 'COMM 101 - Lecture',        'Class',   '2026-06-09', 'Excused',   'Medical certificate submitted',    'Admin User'),
  ('11111111-1111-1111-1111-111111111101', 'Flag Ceremony',             'Event',   '2026-06-15', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111101', 'Midterm Exam',              'Exam',    '2026-06-20', 'Excused',   'Family emergency',                 'Admin User'),
  ('11111111-1111-1111-1111-111111111101', 'COMM 210 - Lab',            'Class',   '2026-06-25', 'Unexcused', null,                              'Admin User'),

  -- Juan Dela Cruz (1)
  ('11111111-1111-1111-1111-111111111102', 'COMM 101 - Lecture',        'Class',   '2026-06-10', 'Unexcused', null,                              'Admin User'),

  -- Mark Villanueva (6)
  ('11111111-1111-1111-1111-111111111104', 'POLSCI 100 - Lecture',      'Class',   '2026-06-01', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111104', 'POLSCI 100 - Lecture',      'Class',   '2026-06-03', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111104', 'Seminar on Governance',     'Seminar', '2026-06-08', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111104', 'POLSCI 150 - Recitation',   'Class',   '2026-06-12', 'Excused',   'Sick leave',                       'Admin User'),
  ('11111111-1111-1111-1111-111111111104', 'Final Exam Review',        'Class',   '2026-06-18', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111104', 'POLSCI 150 - Recitation',   'Class',   '2026-06-22', 'Unexcused', null,                              'Admin User'),

  -- Kristine Bautista (3, all excused)
  ('11111111-1111-1111-1111-111111111105', 'PSYCH 401 - Thesis Defense Prep', 'Class', '2026-06-04', 'Excused', 'Approved leave for research', 'Admin User'),
  ('11111111-1111-1111-1111-111111111105', 'PSYCH 401 - Thesis Defense Prep', 'Class', '2026-06-11', 'Excused', 'Approved leave for research', 'Admin User'),
  ('11111111-1111-1111-1111-111111111105', 'Career Fair',               'Event',   '2026-06-16', 'Excused',   'Official school representative',  'Admin User'),

  -- Paolo Mendoza (2)
  ('11111111-1111-1111-1111-111111111106', 'PSYCH 210 - Lecture',       'Class',   '2026-06-05', 'Excused',   'Dental appointment',               'Admin User'),
  ('11111111-1111-1111-1111-111111111106', 'PSYCH 210 - Lecture',       'Class',   '2026-06-19', 'Pending',   'Awaiting excuse letter',           'Admin User'),

  -- Samantha Cruz (4)
  ('11111111-1111-1111-1111-111111111107', 'PSYCH 305 - Lab',           'Class',   '2026-06-02', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111107', 'PSYCH 305 - Lab',           'Class',   '2026-06-09', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111107', 'Foundation Week',           'Event',   '2026-06-14', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111107', 'PSYCH 305 - Lab',           'Class',   '2026-06-21', 'Unexcused', null,                              'Admin User'),

  -- Enzo Ramirez (1)
  ('11111111-1111-1111-1111-111111111108', 'COMM 100 - Orientation',    'Event',   '2026-06-06', 'Excused',   'Transportation strike',            'Admin User'),

  -- Miguel Torres (2)
  ('11111111-1111-1111-1111-111111111110', 'COMM 220 - Lecture',        'Class',   '2026-06-07', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111110', 'COMM 220 - Lecture',        'Class',   '2026-06-17', 'Unexcused', null,                              'Admin User'),

  -- Nicole Aquino (7)
  ('11111111-1111-1111-1111-111111111111', 'PSYCH 150 - Lecture',       'Class',   '2026-05-28', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111111', 'PSYCH 150 - Lecture',       'Class',   '2026-06-01', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111111', 'PSYCH 150 - Lecture',       'Class',   '2026-06-04', 'Excused',   'Medical certificate submitted',    'Admin User'),
  ('11111111-1111-1111-1111-111111111111', 'Intramurals',               'Event',   '2026-06-08', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111111', 'PSYCH 150 - Lecture',       'Class',   '2026-06-11', 'Unexcused', null,                              'Admin User'),
  ('11111111-1111-1111-1111-111111111111', 'Midterm Exam',              'Exam',    '2026-06-15', 'Pending',   'Awaiting excuse letter',           'Admin User'),
  ('11111111-1111-1111-1111-111111111111', 'PSYCH 150 - Lecture',       'Class',   '2026-06-20', 'Unexcused', null,                              'Admin User'),

  -- Rafael Gonzales (1)
  ('11111111-1111-1111-1111-111111111112', 'POLSCI 100 - Lecture',      'Class',   '2026-06-13', 'Pending',   'Awaiting excuse letter',           'Admin User');
