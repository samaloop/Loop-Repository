'use client'
import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface TemplateResult {
  success: boolean;
  base64?: string;
  filename?: string;
  error?: string;
}

interface DownloadTemplateButtonProps {
  action: () => Promise<TemplateResult>;
  label?: string;
  className?: string;
}

const DEFAULT_CLASSNAME = 'flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-60';

export default function DownloadTemplateButton({ action, label = 'Download Template', className = DEFAULT_CLASSNAME }: DownloadTemplateButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const result = await action();
      if (!result.success || !result.base64 || !result.filename) {
        alert('Gagal membuat template: ' + (result.error || 'Terjadi kesalahan.'));
        return;
      }

      const byteChars = atob(result.base64);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
      const blob = new Blob([new Uint8Array(byteNumbers)], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button onClick={handleDownload} disabled={isDownloading} className={className}>
      {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {label}
    </button>
  );
}
