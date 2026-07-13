import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardShell from './DashboardShell';

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/student-login');
  }

  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const needsProfile =
    !student || !student.student_number || !student.full_name || !student.program;

  return (
    <DashboardShell
      user={{
        id: user.id,
        email: user.email ?? '',
        name: (user.user_metadata?.full_name as string) ?? '',
      }}
      student={student}
      needsProfile={needsProfile}
    />
  );
}