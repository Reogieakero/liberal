'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type CompleteProfileState = { error?: string };

export async function completeStudentProfile(
  _prevState: CompleteProfileState,
  formData: FormData
): Promise<CompleteProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Your session expired. Please sign in again.' };
  }

  const student_number = (formData.get('student_number') as string)?.trim();
  const full_name = (formData.get('full_name') as string)?.trim();
  const program = (formData.get('program') as string)?.trim();
  const year_level = ((formData.get('year_level') as string) || '').trim() || null;
  const section = ((formData.get('section') as string) || '').trim() || null;

  if (!student_number || !full_name || !program) {
    return { error: 'Student number, full name, and program are required.' };
  }

  const { error } = await supabase.from('students').upsert(
    {
      user_id: user.id,
      student_number,
      full_name,
      program,
      year_level,
      section,
      email: user.email,
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    // Postgres unique_violation — most likely the student_number is already taken.
    if (error.code === '23505') {
      return { error: 'That student number is already registered to another account.' };
    }
    return { error: 'Could not save your profile. Please try again.' };
  }

  revalidatePath('/student/dashboard');
  return {};
}