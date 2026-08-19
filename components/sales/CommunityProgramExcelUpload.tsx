'use client'
import { useState } from 'react';
import { Upload } from 'lucide-react';
import ExcelUploadModal from './ExcelUploadModal';
import DownloadTemplateButton from './DownloadTemplateButton';
import { importProspectsForProgram, downloadProspectTemplate } from '@/app/actions/prospects';

export default function CommunityProgramExcelUpload({ programId }: { programId: number }) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <DownloadTemplateButton
          action={downloadProspectTemplate}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-60"
        />
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
        >
          <Upload size={16} /> Upload Excel Peserta
        </button>
      </div>

      <ExcelUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Excel Peserta Program"
        importAction={(formData) => importProspectsForProgram(programId, formData)}
      />
    </>
  );
}
