import Link from 'next/link';
import {
  CheckCircle2, Mail, Phone, Users, FileText, Send, CalendarClock,
  MessageCircle, Search, Headset, MailPlus, UserCheck,
  Handshake, Building2, School, GraduationCap, HeartHandshake, Briefcase,
  ThumbsUp, Sparkles, Gift, Target,
} from 'lucide-react';
import { requireSalesAccess } from '@/lib/salesAccess';

const MINDSET_POINTS = [
  'Dengarkan lebih dulu',
  'Pahami kebutuhan dengan tulus',
  'Berikan solusi terbaik',
  'Bangun kepercayaan',
  'Jalin hubungan jangka panjang',
];

const RFP_STEPS = [
  { icon: Mail, title: 'Inquiry Diterima', points: ['Respons maksimal 1 hari kerja', 'Sapa & ucapkan terima kasih', 'Mengundang untuk discovery call'] },
  { icon: Phone, title: 'Discovery Call', points: ['Call 15–30 menit', 'Gali kebutuhan, tantangan, tujuan, peserta, timeline, budget, ekspektasi hasil'] },
  { icon: Users, title: 'Internal Briefing', points: ['Ringkas kebutuhan', 'Susun rekomendasi solusi'] },
  { icon: FileText, title: 'Proposal Development', points: ['Proposal disesuaikan kebutuhan klien', 'Maksimal 2 hari kerja'] },
  { icon: Send, title: 'Proposal Submission', points: ['Kirim proposal + ucapan terima kasih', 'Tawarkan diskusi/penyesuaian'] },
  { icon: CalendarClock, title: 'Follow Up Proposal', points: ['Lakukan follow up secara konsisten', 'Maksimal 5 kali follow up'] },
];

const RFP_FOLLOW_UPS = [
  { label: 'Follow Up 1', when: 'Hari ke-2', note: 'Pastikan proposal diterima' },
  { label: 'Follow Up 2', when: 'Minggu ke-1', note: 'Jawab pertanyaan / klarifikasi' },
  { label: 'Follow Up 3', when: 'Minggu ke-2', note: 'Berikan insight / studi kasus relevan' },
  { label: 'Follow Up 4', when: 'Minggu ke-3', note: 'Tanyakan perkembangan proses internal' },
  { label: 'Follow Up 5', when: 'Minggu ke-4', note: 'Menutup dengan elegan, Loop siap membantu kapan pun' },
];

const INDIVIDUAL_STEPS = [
  { icon: MessageCircle, title: 'Inquiry Masuk', points: ['Respons maksimal 1 jam kerja', 'Sapa & ucapkan terima kasih'] },
  { icon: Search, title: 'Discovery', points: ['Tanyakan tujuan belajar, pengalaman coaching, target pengembangan, dan program yang sesuai'] },
  { icon: Headset, title: 'Konsultasi (bila diperlukan)', points: ['Call 15–20 menit bersama Senior Sales untuk rekomendasi program terbaik'] },
  { icon: MailPlus, title: 'Kirim Informasi', points: ['Kirim brochure, video testimoni, jadwal, investasi, FAQ, testimoni, dan link pendaftaran pada hari yang sama'] },
  { icon: UserCheck, title: 'Follow Up Personal', points: ['Lakukan follow up personal sesuai jadwal'] },
];

const INDIVIDUAL_FOLLOW_UPS = [
  { label: 'Hari ke-2', note: 'Pastikan informasi sudah diterima' },
  { label: 'Hari ke-7', note: 'Jawab pertanyaan / klarifikasi' },
  { label: '3–5 hari sebelum Early Bird berakhir', note: 'Reminder periode promo' },
  { label: '1 minggu sebelum kelas dimulai', note: 'Final reminder' },
  { label: 'Setelah kelas penuh / ditutup', note: 'Waiting list atau batch berikutnya' },
];

const MONTHLY_TARGETS = [
  { activity: 'Menjalin koneksi baru (Organisasi & Individu)', manager: '10', senior: '4', admin: '-' },
  { activity: 'Coffee Meeting / Catch Up', manager: '4', senior: '4', admin: '-' },
  { activity: 'Menghadiri event komunitas', manager: '2', senior: '2', admin: '-' },
  { activity: 'Menghubungi alumni lama', manager: '10', senior: '20', admin: '20' },
  { activity: 'Mengundang ke webinar / Loopositivity', manager: '✓', senior: '✓', admin: '✓' },
  { activity: 'Follow up alumni pasca program', manager: '✓', senior: '✓', admin: '✓' },
  { activity: 'Update database CRM', manager: 'Review', senior: 'Update', admin: 'Update harian' },
];

const RELATIONSHIP_CHANNELS = [
  { icon: Building2, label: 'Corporate / Organisasi' },
  { icon: Users, label: 'Komunitas & Asosiasi' },
  { icon: School, label: 'Universitas & Sekolah' },
  { icon: GraduationCap, label: 'Individu Learners' },
  { icon: HeartHandshake, label: 'Pro Bono Service' },
  { icon: Briefcase, label: 'Corporate Service' },
];

const CORPORATE_TIMELINE = [
  { period: '2–5 Hari Pertama', points: ['Kirim ucapan terima kasih', 'Meminta feedback (survey / call singkat)', 'Mengirim dokumentasi program'] },
  { period: '30 Hari', points: ['Menanyakan implementasi hasil pembelajaran', 'Menggali tantangan yang muncul', 'Berbagi artikel, tools, atau insight yang relevan'] },
  { period: '60–90 Hari', points: ['Mengundang ke webinar atau community sharing', 'Berbagi success story praktik baik', 'Mengidentifikasi kebutuhan pengembangan berikutnya'] },
  { period: '6 Bulan', points: ['Executive check-in bersama stakeholder utama', 'Diskusi tantangan organisasi saat ini', 'Menawarkan program lanjutan / refresh session atau coaching jika dibutuhkan'] },
];

const RELATIONSHIP_INDICATORS = [
  'Feedback program diperoleh',
  'Hubungan dengan PIC tetap aktif',
  'Minimal 2–3 touchpoints setelah program',
  'Muncul peluang repeat program, referral atau kolaborasi baru',
  'Kepuasan klien meningkat',
  'Menjadi advocate & referral partner',
];

const COMMUNITY_COLUMNS = [
  {
    title: 'Community Engagement',
    points: ['Mengundang alumni ke webinar', 'Pro bono coaching / learning partner', 'Menghubungkan alumni satu sama lain', 'Menjadi volunteer / kontributor komunitas'],
  },
  {
    title: 'Thought Leadership',
    points: ['Artikel & insight mingguan', 'Success story alumni', 'Sharing tools & praktik coaching', 'Podcast / webinar / live session'],
  },
  {
    title: 'Relationship Touch Point',
    points: ['Ucapan ulang tahun / hari raya', 'Undangan webinar / event', 'Artikel yang relevan', 'Coffee chat / catch-up', 'Informasi program terbaru'],
  },
];

const COMMUNITY_GOALS = [
  'Memberi nilai sebelum menawarkan program',
  'Memperkuat hubungan jangka panjang',
  'Menciptakan komunitas yang saling mendukung',
  'Menumbuhkan trust, advocacy & referral',
];

const SUCCESS_METRICS = [
  'Kecepatan Merespon',
  'Kualitas Discovery Conversation',
  'Jumlah Hubungan Baru',
  'Follow Up Konsisten',
  'Engagement Alumni & Komunitas',
  'Repeat Business',
  'Referral & Kolaborasi',
  'Kontribusi ke Ekosistem Coaching',
];

const TEAM_ROLES = [
  { title: 'Sales Manager', points: ['Strategic Relationship', 'Key Corporate Accounts', 'Business Development', 'Partnership Development'] },
  { title: 'Senior Sales', points: ['Discovery Call', 'Proposal Solution', 'Client Meeting', 'Follow Up & Closing', 'Relationship Management'] },
  { title: 'Sales Admin', points: ['Fast Response', 'Proposal Support', 'CRM & Database Management', 'Community & Customer Care'] },
];

function SectionCard({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className={`bg-white rounded-[2rem] border-t-4 ${accent} border-x border-b border-slate-100 shadow-sm p-6 md:p-8`}>
      {children}
    </div>
  );
}

export default async function SalesPlaybookPage() {
  await requireSalesAccess();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        <nav className="flex items-center gap-2 text-xs md:text-sm">
          <Link href="/sales" className="text-slate-400 hover:text-cyan-600 transition-colors">Sales & Marketing</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">SOP & Relationship Playbook</span>
        </nav>

        {/* HERO */}
        <div className="text-center space-y-3">
          <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-[10px] font-black uppercase tracking-widest">
            Loop Institute of Coaching
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-slate-800">Every Interaction Creates Relationship</h1>
        </div>

        {/* MINDSET */}
        <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 text-white">
          <h2 className="text-sm font-black uppercase tracking-widest text-cyan-300 mb-4">Mindset Relationship</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {MINDSET_POINTS.map((point) => (
              <div key={point} className="flex items-start gap-2 text-sm font-medium">
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                {point}
              </div>
            ))}
          </div>
          <p className="text-slate-300 text-sm mt-5 pt-5 border-t border-white/10 italic">
            Prinsip Utama: Setiap percakapan adalah awal dari hubungan, bukan sekadar transaksi.
          </p>
        </div>

        {/* A & B */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard accent="border-blue-500">
            <h2 className="text-base font-black text-blue-700 mb-5">A. Corporate / Organization — Request for Proposal (RFP)</h2>
            <ol className="space-y-4">
              {RFP_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center">{i + 1}</span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{step.title}</p>
                    <ul className="text-xs text-slate-500 mt-1 space-y-0.5 list-disc list-inside">
                      {step.points.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <h3 className="text-xs font-black text-blue-700 uppercase tracking-widest mt-6 mb-3">Jadwal Follow Up (RFP)</h3>
            <div className="space-y-2">
              {RFP_FOLLOW_UPS.map((fu) => (
                <div key={fu.label} className="flex items-start gap-3 bg-blue-50/50 rounded-xl p-3">
                  <CalendarClock size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-700">{fu.label} &middot; {fu.when}</span>
                    <p className="text-slate-500 mt-0.5">{fu.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mt-5 text-xs text-slate-500 space-y-1">
              <p className="font-black text-slate-600 uppercase tracking-widest text-[10px] mb-1">Catatan Relationship</p>
              <p>Semua interaksi dicatat di CRM.</p>
              <p>Tidak mengejar penjualan, fokus memberi nilai.</p>
              <p>Jika belum closing, tetap jaga hubungan melalui konten, webinar, komunitas.</p>
            </div>
          </SectionCard>

          <SectionCard accent="border-emerald-500">
            <h2 className="text-base font-black text-emerald-700 mb-5">B. Individual — Public Training Inquiry</h2>
            <ol className="space-y-4">
              {INDIVIDUAL_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center">{i + 1}</span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{step.title}</p>
                    <ul className="text-xs text-slate-500 mt-1 space-y-0.5 list-disc list-inside">
                      {step.points.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <div className="bg-emerald-50/50 rounded-xl p-4 mt-5 text-xs">
              <p className="font-black text-emerald-700 uppercase tracking-widest text-[10px] mb-1">Pendekatan: Consultative Selling</p>
              <p className="text-slate-600">Membantu peserta memilih program terbaik, bukan mendorong semua orang masuk.</p>
            </div>

            <h3 className="text-xs font-black text-emerald-700 uppercase tracking-widest mt-6 mb-3">Jadwal Follow Up (Individual)</h3>
            <div className="space-y-2">
              {INDIVIDUAL_FOLLOW_UPS.map((fu) => (
                <div key={fu.label} className="flex items-start gap-3 bg-emerald-50/50 rounded-xl p-3">
                  <CalendarClock size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-700">{fu.label}</span>
                    <p className="text-slate-500 mt-0.5">{fu.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* C. RELATIONSHIP EXPANSION */}
        <SectionCard accent="border-amber-500">
          <h2 className="text-base font-black text-amber-700 mb-1">C. Relationship Expansion</h2>
          <p className="text-xs text-slate-400 mb-5">Memperluas tebaran</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[520px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="p-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Aktivitas Bulanan</th>
                  <th className="p-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Sales Manager</th>
                  <th className="p-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Senior Sales</th>
                  <th className="p-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Sales Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MONTHLY_TARGETS.map((row) => (
                  <tr key={row.activity}>
                    <td className="p-3 text-slate-700 font-medium">{row.activity}</td>
                    <td className="p-3 text-center text-slate-600 font-bold">{row.manager}</td>
                    <td className="p-3 text-center text-slate-600 font-bold">{row.senior}</td>
                    <td className="p-3 text-center text-slate-600 font-bold">{row.admin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xs font-black text-amber-700 uppercase tracking-widest mt-6 mb-3">Channel Relationship</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {RELATIONSHIP_CHANNELS.map((ch) => (
              <div key={ch.label} className="bg-amber-50/50 rounded-xl p-3 text-center">
                <ch.icon size={18} className="text-amber-600 mx-auto mb-1.5" />
                <p className="text-[11px] font-bold text-slate-600">{ch.label}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* D. CORPORATE SERVICE RELATIONSHIP */}
        <SectionCard accent="border-violet-500">
          <h2 className="text-base font-black text-violet-700 mb-1">D. Corporate Service Relationship</h2>
          <p className="text-xs text-slate-400 mb-5">Setelah program selesai, hubungan justru dimulai</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CORPORATE_TIMELINE.map((stage) => (
              <div key={stage.period} className="bg-violet-50/50 rounded-xl p-4">
                <p className="font-black text-violet-700 text-xs uppercase tracking-widest mb-2">{stage.period}</p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  {stage.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="text-xs font-black text-violet-700 uppercase tracking-widest mt-6 mb-3">Indikator Relationship</h3>
          <div className="flex flex-wrap gap-2">
            {RELATIONSHIP_INDICATORS.map((ind, i) => (
              <span key={ind} className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 text-xs font-medium px-3 py-1.5 rounded-full">
                {i > 0 && <span className="text-violet-300">&rarr;</span>} {ind}
              </span>
            ))}
          </div>
        </SectionCard>

        {/* E. COMMUNITY RELATIONSHIP STRATEGY */}
        <SectionCard accent="border-pink-500">
          <h2 className="text-base font-black text-pink-700 mb-5">E. Community Relationship Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMMUNITY_COLUMNS.map((col) => (
              <div key={col.title} className="bg-pink-50/50 rounded-xl p-4">
                <p className="font-black text-pink-700 text-xs uppercase tracking-widest mb-2">{col.title}</p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  {col.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 rounded-xl p-4 mt-4">
            <p className="font-black text-slate-600 text-[10px] uppercase tracking-widest mb-2">Tujuan</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {COMMUNITY_GOALS.map((g) => (
                <p key={g} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <Target size={13} className="text-pink-500 shrink-0 mt-0.5" /> {g}
                </p>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* SUCCESS METRICS */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">Success Metrics (Hubungan)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SUCCESS_METRICS.map((metric) => (
              <div key={metric} className="text-center bg-slate-50 rounded-xl p-4">
                <ThumbsUp size={18} className="text-cyan-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">{metric}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM ROLES */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">Peran Tim Relationship</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEAM_ROLES.map((role) => (
              <div key={role.title} className="bg-slate-50 rounded-xl p-4">
                <p className="font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                  <Handshake size={16} className="text-cyan-600" /> {role.title}
                </p>
                <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                  {role.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* MOTTO & CLOSING */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8 text-center">
          <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mb-3">Motto Team</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold text-slate-700 mb-6">
            <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-cyan-500" /> Connect with Purpose</span>
            <span className="flex items-center gap-1.5"><Gift size={14} className="text-cyan-500" /> Serve with Care</span>
            <span className="flex items-center gap-1.5"><Handshake size={14} className="text-cyan-500" /> Build Trust</span>
            <span className="flex items-center gap-1.5"><Users size={14} className="text-cyan-500" /> Grow Together</span>
          </div>
          <div className="bg-slate-900 text-white rounded-2xl p-5 text-xs md:text-sm font-bold">
            Relationship bukan sekadar menjual program, tetapi membangun kepercayaan yang menciptakan dampak berkelanjutan.
          </div>
        </div>
      </div>
    </div>
  );
}
