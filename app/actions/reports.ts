'use server'

import { revalidatePath } from 'next/cache';
import { getAuthorizedSalesContext } from '@/lib/serverAuth';
import { ACTIVITY_CATALOG, ReportType, activitySlug, getMonday, TEAM_REVIEW_QUESTIONS } from '@/lib/reportActivities';

export async function submitWeeklyReport(formData: FormData) {
  const { supabase, authorized, picUserId } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const reportType = formData.get('report_type') as ReportType;
  const catalog = ACTIVITY_CATALOG[reportType];
  if (!catalog) return { success: false, error: 'Jenis laporan tidak valid.' };

  const reporterName = (formData.get('reporter_name') as string || '').trim();
  if (!reporterName) return { success: false, error: 'Nama wajib diisi.' };

  const weekInput = formData.get('week_start_date') as string;
  if (!weekInput) return { success: false, error: 'Minggu wajib diisi.' };
  const weekStartDate = getMonday(weekInput);

  const activities = catalog.map((def) => {
    const raw = formData.get(`actual__${def.pillar}__${activitySlug(def.activity)}`);
    const actual = Number(raw) || 0;
    return { ...def, actual };
  });

  const { error } = await supabase.from('WeeklyReport').insert({
    user_id: picUserId,
    reporter_name: reporterName,
    report_type: reportType,
    week_start_date: weekStartDate,
    activities,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/reports');
  revalidatePath('/sales/reports/monthly');
  return { success: true };
}

export async function upsertTeamReview(formData: FormData) {
  const { supabase, authorized, picUserId } = await getAuthorizedSalesContext();
  if (!authorized) return { success: false, error: 'Tidak memiliki akses.' };

  const weekInput = formData.get('week_start_date') as string;
  if (!weekInput) return { success: false, error: 'Minggu wajib diisi.' };
  const weekStartDate = getMonday(weekInput);

  const answers: Record<string, string | null> = {};
  for (const q of TEAM_REVIEW_QUESTIONS) {
    const value = (formData.get(q.key) as string || '').trim();
    answers[q.key] = value === '' ? null : value;
  }

  const { data: existing } = await supabase
    .from('TeamReview')
    .select('id')
    .eq('week_start_date', weekStartDate)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from('TeamReview').update({ ...answers, filled_by_user_id: picUserId }).eq('id', existing.id)
    : await supabase.from('TeamReview').insert({ ...answers, week_start_date: weekStartDate, filled_by_user_id: picUserId });

  if (error) return { success: false, error: error.message };

  revalidatePath('/sales/reports/team-review');
  return { success: true };
}
