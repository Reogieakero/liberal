-- ============================================
-- STUDENTS (skip if you already have this table)
-- ============================================
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  student_number text unique not null,
  full_name text not null,
  program text not null,
  year_level text,
  section text,
  email text,
  created_at timestamptz default now()
);

-- ============================================
-- ABSENCES — one row per absence event
-- ============================================
create table if not exists absences (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  event_name text not null,          -- e.g. "CS101 - Jan 14", "Flag Ceremony", "Midterm Exam"
  event_type text not null default 'Class'
    check (event_type in ('Class','Event','Exam','Seminar','Other')),
  absence_date date not null,
  status text not null default 'Unexcused'
    check (status in ('Excused','Unexcused','Pending')),
  reason text,
  recorded_by text,
  created_at timestamptz default now()
);

create index if not exists idx_absences_student_id on absences(student_id);
create index if not exists idx_absences_date on absences(absence_date desc);

-- ============================================
-- SUMMARY VIEW — powers the main table (1 row per student)
-- security_invoker so RLS on the base tables is respected
-- ============================================
create or replace view student_absence_summary
with (security_invoker = true) as
select
  s.id as student_id,
  s.student_number,
  s.full_name,
  s.program,
  s.year_level,
  s.section,
  count(a.id) as total_absences,
  count(a.id) filter (where a.status = 'Excused') as excused_count,
  count(a.id) filter (where a.status = 'Unexcused') as unexcused_count,
  max(a.absence_date) as last_absence_date
from students s
left join absences a on a.student_id = s.id
group by s.id, s.student_number, s.full_name, s.program, s.year_level, s.section;

-- ============================================
-- RLS
-- ============================================
alter table students enable row level security;
alter table absences enable row level security;

create policy "Authenticated can manage students"
  on students for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated can manage absences"
  on absences for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
