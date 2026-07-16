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

  const [paymentMethodsRes, announcementsRes] = await Promise.all([
    supabase
      .from('payment_methods')
      .select('*')
      .eq('is_active', true)
      .order('method_type', { ascending: true }),
    supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2),
  ]);

  if (paymentMethodsRes.error) {
    console.error('payment_methods query failed:', paymentMethodsRes.error.message);
  }
  if (announcementsRes.error) {
    console.error('announcements query failed:', announcementsRes.error.message);
  }

  const paymentMethods = paymentMethodsRes.data ?? [];
  const announcements = announcementsRes.data ?? [];

  return (
    <DashboardShell
      user={{
        id: user.id,
        email: user.email ?? '',
        name: (user.user_metadata?.full_name as string) ?? '',
      }}
      student={student}
      needsProfile={needsProfile}
      paymentMethods={paymentMethods}
      announcements={announcements}
    />
  );
}