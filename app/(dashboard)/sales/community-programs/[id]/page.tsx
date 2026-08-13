import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireSalesAccess } from '@/lib/salesAccess';
import { ringBadgeClass } from '@/lib/prospectFields';
import DeleteCommunityProgramButton from '@/components/sales/DeleteCommunityProgramButton';
import LinkProspectToProgramForm from '@/components/sales/LinkProspectToProgramForm';
import UnlinkProspectButton from '@/components/sales/UnlinkProspectButton';
import CommunityProgramExcelUpload from '@/components/sales/CommunityProgramExcelUpload';

interface ProspectLink {
  prospect_id: number;
  Prospect: { id: number; full_name: string; ring: string; email: string | null; whatsapp: string | null; company: string | null };
}

export default async function CommunityProgramDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { supabase } = await requireSalesAccess();

  const { data: program } = await supabase.from('CommunityProgram').select('*').eq('id', id).single();
  if (!program) notFound();

  const [{ data: links }, { data: allProspects }] = await Promise.all([
    supabase
      .from('ProspectCommunityProgram')
      .select('prospect_id, Prospect(id, full_name, ring, email, whatsapp, company)')
      .eq('community_program_id', id),
    supabase.from('Prospect').select('id, full_name').order('full_name'),
  ]);

  const typedLinks = (links || []) as unknown as ProspectLink[];
  const linkedProspectIds = new Set(typedLinks.map((l) => l.prospect_id));
  const availableProspects = (allProspects || []).filter((p) => !linkedProspectIds.has(p.id));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <nav className="flex items-center gap-2 text-xs md:text-sm">
          <Link href="/sales/community-programs" className="text-slate-400 hover:text-cyan-600 transition-colors">Program Komunitas</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold truncate">{program.community_name}</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">{program.community_name}</h1>
            <p className="text-sm text-slate-400 mt-1">
              {program.category || 'Tanpa kategori'} &middot; {program.event_date || 'Tanggal belum diatur'} {program.event_time ? `· ${program.event_time}` : ''}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Blast Program: <span className="font-medium text-slate-600">{program.blast_date || '-'}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/sales/community-programs/${program.id}/edit`}
              className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-600 px-6 py-3 rounded-2xl text-sm font-black transition-all border border-amber-100/50"
            >
              Edit
            </Link>
            <DeleteCommunityProgramButton id={program.id} name={program.community_name} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">Peserta / Calon Client</h2>
            <CommunityProgramExcelUpload programId={program.id} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Atau kaitkan calon client yang sudah ada</p>
            <LinkProspectToProgramForm programId={program.id} prospectOptions={availableProspects} />
          </div>

          {typedLinks.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
              {typedLinks.map((link) => (
                <div key={link.prospect_id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
                  <Link href={`/sales/prospects/${link.Prospect.id}`} className="hover:text-cyan-600 min-w-0">
                    <p className="font-bold text-slate-700 text-sm">{link.Prospect.full_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{link.Prospect.company || '-'}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{link.Prospect.email || '-'} &middot; {link.Prospect.whatsapp || '-'}</p>
                  </Link>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ringBadgeClass(link.Prospect.ring)}`}>
                      {link.Prospect.ring}
                    </span>
                    <UnlinkProspectButton programId={program.id} prospectId={link.Prospect.id} name={link.Prospect.full_name} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-slate-400 italic bg-white rounded-2xl border border-slate-100">
              Belum ada calon client yang terkait dengan program ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
