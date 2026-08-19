'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Upload, Plus, Settings } from 'lucide-react';
import ExcelUploadModal from './ExcelUploadModal';
import DownloadTemplateButton from './DownloadTemplateButton';
import { importProspectsFromExcel, downloadProspectTemplate } from '@/app/actions/prospects';

export default function ProspectsToolbar() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <Link
          href="/sales/prospects/industry-sectors"
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
        >
          <Settings size={16} /> Kelola Sektor Industri
        </Link>
        <DownloadTemplateButton action={downloadProspectTemplate} />
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
        >
          <Upload size={16} /> Upload Excel
        </button>
        <Link
          href="/sales/prospects/new"
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-cyan-100 transition-all"
        >
          <Plus size={16} /> Tambah Manual
        </Link>
      </div>

      <ExcelUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Excel Calon Client"
        importAction={importProspectsFromExcel}
      />
    </>
  );
}
