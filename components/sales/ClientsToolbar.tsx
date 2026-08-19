'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Upload, Plus } from 'lucide-react';
import ExcelUploadModal from './ExcelUploadModal';
import DownloadTemplateButton from './DownloadTemplateButton';
import { importClientsFromExcel, downloadClientTemplate } from '@/app/actions/sales';

export default function ClientsToolbar() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <DownloadTemplateButton action={downloadClientTemplate} />
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
        >
          <Upload size={16} /> Upload Excel
        </button>
        <Link
          href="/sales/clients/new"
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-cyan-100 transition-all"
        >
          <Plus size={16} /> Tambah Manual
        </Link>
      </div>

      <ExcelUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Excel Peserta"
        importAction={importClientsFromExcel}
      />
    </>
  );
}
