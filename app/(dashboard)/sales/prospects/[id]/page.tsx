import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireSalesAccess } from '@/lib/salesAccess';
import { ringBadgeClass } from '@/lib/prospectFields';
import DeleteProspectButton from '@/components/sales/DeleteProspectButton';
import ProspectFollowUpList from '@/components/sales/ProspectFollowUpList';

interface ProgramLink {
  community_program_id: number;
  CommunityProgram: { id: number; community_name: string; category: string | null; event_date: string | null };
}

const DETAIL_FIELDS: { key: string; label: string }[] = [
  { key: 'gender', label: 'Jenis Kelamin' },
  { key: 'company', label: 'Perusahaan/Organisasi' },
  { key: 'job_title', label: 'Jabatan' },
  { key: 'whatsapp', label: 'Whatsapp' },
  { key: 'email', label: 'Email' },
  { key: 'source', label: 'Sumber Informasi' },
  { key: 'contact_type', label: 'Jenis Kontak' },
  { key: 'interested_program', label: 'Tertarik Program Apa' },
  { key: 'year', label: 'Tahun' },
  { key: 'age', label: 'Usia' },
  { key: 'domicile', label: 'Domisili' },
  { key: 'industry_sector', label: 'Sektor Industri' },
];

export default async function ProspectDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { supabase } = await requireSalesAccess();

  const { data: prospect } = await supabase.from('Prospect').select('*').eq('id', id).single();
  if (!prospect) notFound();

  const { data: company } = prospect.company_id
    ? await supabase.from('Company').select('id, company_name').eq('id', prospect.company_id).single()
    : { data: null };

  const { data: links } = await supabase
    .from('ProspectCommunityProgram')
    .select('community_program_id, CommunityProgram(id, community_name, category, event_date)')
    .eq('prospect_id', id);

  const { data: followUps } = await supabase
    .from('ProspectFollowUp')
    .select('id, follow_up_date, detail')
    .eq('prospect_id', id)
    .order('follow_up_date');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <nav className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/sales/prospects" className="text-slate-400 hover:text-cyan-600 transition-colors">Calon Client</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold truncate">{prospect.full_name}</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">{prospect.full_name}</h1>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ringBadgeClass(prospect.ring)}`}>
              {prospect.ring}
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/sales/prospects/${prospect.id}/edit`}
              className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-600 px-6 py-3 rounded-2xl text-sm font-black transition-all border border-amber-100/50"
            >
              Edit
            </Link>
            <DeleteProspectButton id={prospect.id} name={prospect.full_name} />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {DETAIL_FIELDS.map((field) => (
              <div key={field.key}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{field.label}</p>
                <p className="text-slate-700 font-medium">{prospect[field.key] || '-'}</p>
              </div>
            ))}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Perusahaan Terdaftar</p>
              {company ? (
                <Link href={`/sales/companies/${company.id}`} className="text-cyan-600 font-medium hover:underline">
                  {company.company_name}
                </Link>
              ) : (
                <p className="text-slate-700 font-medium">-</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">Riwayat Follow Up</h2>
          <ProspectFollowUpList prospectId={prospect.id} initialFollowUps={followUps || []} />
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">Program Komunitas Terkait</h2>
          {links && links.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
              {(links as unknown as ProgramLink[]).map((link) => (
                <Link
                  key={link.community_program_id}
                  href={`/sales/community-programs/${link.CommunityProgram.id}`}
                  className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-700 text-sm">{link.CommunityProgram.community_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{link.CommunityProgram.category || '-'}</p>
                  </div>
                  <span className="text-xs text-slate-400">{link.CommunityProgram.event_date || '-'}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-slate-400 italic bg-white rounded-2xl border border-slate-100">
              Belum terkait dengan program komunitas manapun.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
