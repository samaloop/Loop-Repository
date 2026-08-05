import Link from 'next/link';
import { requireSalesAccess } from '@/lib/salesAccess';
import { TEAM_REVIEW_QUESTIONS } from '@/lib/reportActivities';
import TeamReviewForm from '@/components/sales/TeamReviewForm';

export default async function TeamReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { supabase } = await requireSalesAccess();
  const { week } = await searchParams;

  const { data: reviews } = await supabase
    .from('TeamReview')
    .select('*')
    .order('week_start_date', { ascending: false })
    .limit(12);

  const editingReview = week ? reviews?.find((r) => r.week_start_date === week) : undefined;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <nav className="flex items-center gap-2 text-xs md:text-sm">
          <Link href="/sales/reports" className="text-slate-400 hover:text-cyan-600 transition-colors">Weekly Report</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">Team Review</span>
        </nav>

        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800">Weekly Team Review</h1>
          <p className="text-sm text-slate-400 mt-1">Satu entri mewakili seluruh tim per minggu (diskusi 15 menit).</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-10">
          {editingReview ? (
            <p className="text-xs text-amber-600 font-bold mb-4">Mengedit review minggu {editingReview.week_start_date}.</p>
          ) : null}
          <TeamReviewForm
            key={editingReview?.id ?? 'new'}
            defaultValues={editingReview}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">Riwayat Review</h2>
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-800">Minggu {review.week_start_date}</p>
                  <Link href={`/sales/reports/team-review?week=${review.week_start_date}`} className="text-amber-500 font-bold text-xs">Edit</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TEAM_REVIEW_QUESTIONS.map((q) => (
                    <div key={q.key}>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{q.label}</p>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{review[q.key] || '-'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="p-10 text-center text-slate-400 italic bg-white rounded-[2.5rem] border border-slate-100">
              Belum ada team review.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
