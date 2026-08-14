'use client'
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, ArrowUpDown, X } from 'lucide-react';
import { deleteProspect } from '@/app/actions/prospects';
import { RING_OPTIONS, CONTACT_TYPE_OPTIONS, ringBadgeClass, type ProspectRecord } from '@/lib/prospectFields';

interface ProspectTableProps {
  initialProspects: ProspectRecord[];
}

type SortKey = 'full_name' | 'email' | 'company' | 'job_title' | 'source' | 'contact_type' | 'interested_program'
  | 'domicile' | 'industry_sector' | 'age' | 'year' | 'ring' | 'created_at';
type SortDirection = 'asc' | 'desc';

const SORT_COLUMNS: { key: SortKey; label: string; align?: 'center' }[] = [
  { key: 'full_name', label: 'Nama' },
  { key: 'email', label: 'Kontak' },
  { key: 'company', label: 'Perusahaan/Organisasi' },
  { key: 'job_title', label: 'Jabatan' },
  { key: 'source', label: 'Sumber' },
  { key: 'contact_type', label: 'Jenis Kontak', align: 'center' },
  { key: 'interested_program', label: 'Tertarik Program' },
  { key: 'domicile', label: 'Domisili' },
  { key: 'industry_sector', label: 'Sektor Industri' },
  { key: 'age', label: 'Usia', align: 'center' },
  { key: 'year', label: 'Tahun', align: 'center' },
  { key: 'ring', label: 'Kategori-Ring', align: 'center' },
  { key: 'created_at', label: 'Tanggal Dibuat', align: 'center' },
];

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function RingBadge({ ring }: { ring: string }) {
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ringBadgeClass(ring)}`}>
      {ring}
    </span>
  );
}

interface SortableHeaderProps {
  label: string;
  active: boolean;
  direction: SortDirection;
  align?: 'left' | 'center' | 'right';
  onClick: () => void;
}

function SortableHeader({ label, active, direction, align = 'left', onClick }: SortableHeaderProps) {
  const Icon = active ? (direction === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
  const justify = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';
  return (
    <th className={`p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest whitespace-nowrap text-${align}`}>
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-1.5 ${justify} w-full hover:text-slate-800 transition-colors ${active ? 'text-slate-800' : ''}`}
      >
        {label}
        <Icon size={12} className={active ? 'opacity-100' : 'opacity-40'} />
      </button>
    </th>
  );
}

export default function ProspectTable({ initialProspects }: ProspectTableProps) {
  const [prospects, setProspects] = useState(initialProspects);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [ringFilter, setRingFilter] = useState('');
  const [industrySectorFilter, setIndustrySectorFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [contactTypeFilter, setContactTypeFilter] = useState('');

  const industrySectorOptions = useMemo(
    () => Array.from(new Set(prospects.map((p) => p.industry_sector).filter((v): v is string => !!v))).sort((a, b) => a.localeCompare(b, 'id')),
    [prospects]
  );
  const companyOptions = useMemo(
    () => Array.from(new Set(prospects.map((p) => p.company).filter((v): v is string => !!v))).sort((a, b) => a.localeCompare(b, 'id')),
    [prospects]
  );

  const hasActiveFilter = ringFilter !== '' || industrySectorFilter !== '' || companyFilter !== '' || contactTypeFilter !== '';
  const resetFilters = () => {
    setRingFilter('');
    setIndustrySectorFilter('');
    setCompanyFilter('');
    setContactTypeFilter('');
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      if (ringFilter && p.ring !== ringFilter) return false;
      if (industrySectorFilter && p.industry_sector !== industrySectorFilter) return false;
      if (companyFilter && p.company !== companyFilter) return false;
      if (contactTypeFilter && p.contact_type !== contactTypeFilter) return false;
      return true;
    });
  }, [prospects, ringFilter, industrySectorFilter, companyFilter, contactTypeFilter]);

  const sortedProspects = useMemo(() => {
    if (!sortKey) return filteredProspects;

    const getValue = (p: ProspectRecord): string | number | null => {
      if (sortKey === 'email') return p.email || p.whatsapp;
      return p[sortKey];
    };

    const sorted = [...filteredProspects].sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);

      if (va === null || va === undefined || va === '') return 1;
      if (vb === null || vb === undefined || vb === '') return -1;

      if (typeof va === 'number' && typeof vb === 'number') return va - vb;
      return String(va).localeCompare(String(vb), 'id', { sensitivity: 'base' });
    });

    return sortDirection === 'asc' ? sorted : sorted.reverse();
  }, [filteredProspects, sortKey, sortDirection]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus calon client "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;

    const result = await deleteProspect(id);
    if (!result.success) {
      alert('Gagal menghapus: ' + result.error);
      return;
    }
    setProspects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 flex flex-col sm:flex-row sm:items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-40">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Kategori-Ring</label>
          <select
            value={ringFilter}
            onChange={(e) => setRingFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium text-sm"
          >
            <option value="">Semua Ring</option>
            {RING_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-40">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Sektor Industri</label>
          <select
            value={industrySectorFilter}
            onChange={(e) => setIndustrySectorFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium text-sm"
          >
            <option value="">Semua Sektor</option>
            {industrySectorOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-40">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Perusahaan/Organisasi</label>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium text-sm"
          >
            <option value="">Semua Perusahaan</option>
            {companyOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-40">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Jenis Kontak</label>
          <select
            value={contactTypeFilter}
            onChange={(e) => setContactTypeFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none appearance-none font-medium text-sm"
          >
            <option value="">Semua Jenis</option>
            {CONTACT_TYPE_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
          >
            <X size={14} /> Reset Filter
          </button>
        )}
      </div>

      <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                {SORT_COLUMNS.map((col) => (
                  <SortableHeader
                    key={col.key}
                    label={col.label}
                    align={col.align}
                    active={sortKey === col.key}
                    direction={sortDirection}
                    onClick={() => handleSort(col.key)}
                  />
                ))}
                <th className="p-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-right whitespace-nowrap">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedProspects.length > 0 ? (
                sortedProspects.map((prospect) => (
                  <tr key={prospect.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 whitespace-nowrap">
                      <p className="font-bold text-slate-700">{prospect.full_name}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{prospect.gender || '-'}</p>
                    </td>
                    <td className="p-6 text-slate-600 text-sm whitespace-nowrap">
                      <p>{prospect.email || '-'}</p>
                      <p className="text-slate-400 mt-1">{prospect.whatsapp || '-'}</p>
                    </td>
                    <td className="p-6 text-slate-600 text-sm whitespace-nowrap">{prospect.company || '-'}</td>
                    <td className="p-6 text-slate-600 text-sm whitespace-nowrap">{prospect.job_title || '-'}</td>
                    <td className="p-6 text-slate-600 text-sm whitespace-nowrap">{prospect.source || '-'}</td>
                    <td className="p-6 text-slate-600 text-sm text-center whitespace-nowrap">{prospect.contact_type || '-'}</td>
                    <td className="p-6 text-slate-600 text-sm whitespace-nowrap">{prospect.interested_program || '-'}</td>
                    <td className="p-6 text-slate-600 text-sm whitespace-nowrap">{prospect.domicile || '-'}</td>
                    <td className="p-6 text-slate-600 text-sm whitespace-nowrap">{prospect.industry_sector || '-'}</td>
                    <td className="p-6 text-slate-600 text-sm text-center whitespace-nowrap">{prospect.age ?? '-'}</td>
                    <td className="p-6 text-slate-600 text-sm text-center whitespace-nowrap">{prospect.year ?? '-'}</td>
                    <td className="p-6 text-center whitespace-nowrap">
                      <RingBadge ring={prospect.ring} />
                    </td>
                    <td className="p-6 text-slate-600 text-sm text-center whitespace-nowrap">{formatDate(prospect.created_at)}</td>
                    <td className="p-6 text-right whitespace-nowrap">
                      <div className="flex justify-end items-center gap-4">
                        <Link href={`/sales/prospects/${prospect.id}`} className="text-cyan-600 font-bold hover:text-cyan-700 text-sm">Detail</Link>
                        <Link href={`/sales/prospects/${prospect.id}/edit`} className="text-amber-500 font-bold hover:text-amber-600 text-sm">Edit</Link>
                        <button onClick={() => handleDelete(prospect.id, prospect.full_name)} className="text-rose-500 font-bold hover:text-rose-600 text-sm">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={14} className="p-20 text-center text-slate-400 italic">{hasActiveFilter ? 'Tidak ada calon client yang cocok dengan filter.' : 'Belum ada calon client.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {sortedProspects.length === 0 && (
          <p className="p-10 text-center text-slate-400 italic">{hasActiveFilter ? 'Tidak ada calon client yang cocok dengan filter.' : 'Belum ada calon client.'}</p>
        )}
        {sortedProspects.map((prospect) => (
          <div key={prospect.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <RingBadge ring={prospect.ring} />
              <div className="flex gap-3 text-xs font-bold">
                <Link href={`/sales/prospects/${prospect.id}`} className="text-cyan-600">Detail</Link>
                <Link href={`/sales/prospects/${prospect.id}/edit`} className="text-amber-500">Edit</Link>
                <button onClick={() => handleDelete(prospect.id, prospect.full_name)} className="text-rose-500">Hapus</button>
              </div>
            </div>
            <h3 className="font-bold text-slate-800">{prospect.full_name}</h3>
            <p className="text-xs text-slate-400 mt-1">{prospect.gender || '-'}</p>
            <p className="text-xs text-slate-400 mt-1">{prospect.company || '-'} &middot; {prospect.job_title || '-'}</p>
            <p className="text-xs text-slate-400 mt-1">{prospect.email || '-'} &middot; {prospect.whatsapp || '-'}</p>
            <p className="text-xs text-slate-500 mt-1">{prospect.interested_program || '-'}</p>
            <p className="text-xs text-slate-400 mt-1">{prospect.domicile || '-'} &middot; {prospect.industry_sector || '-'}</p>
            <p className="text-xs text-slate-400 mt-1">Usia {prospect.age ?? '-'} &middot; Tahun {prospect.year ?? '-'} &middot; Sumber: {prospect.source || '-'}</p>
            <p className="text-xs text-slate-400 mt-1">Jenis Kontak: {prospect.contact_type || '-'}</p>
            <p className="text-xs text-slate-400 mt-1">Dibuat: {formatDate(prospect.created_at)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
