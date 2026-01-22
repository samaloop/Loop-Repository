// components/FileTable.tsx
'use client'
import { useState } from 'react';
import { FileText, Trash2, Edit, Download, Plus } from 'lucide-react';
import { deleteFile } from '@/app/actions/gdrive';
import UploadModal from './UploadModal';

interface FileData {
  id: number;
  name: string;
  category: string;
  download_link: string;
  gdrive_id: string;
}

export default function FileTable({ initialFiles, programId }: { initialFiles: any[], programId: string }) {
  const [activeTab, setActiveTab] = useState('Materi');
  const [files, setFiles] = useState(initialFiles);
  const [isModalOpen, setIsModalOpen] = useState(false); // State modal

  const filteredFiles = files.filter(f => f.category.toLowerCase() === activeTab.toLowerCase());

  // Fungsi untuk menambah file ke list setelah upload sukses
  const handleUploadSuccess = (newFile: any) => {
    // Karena Supabase mengembalikan data dalam array, ambil index 0
    const fileData = Array.isArray(newFile) ? newFile[0] : newFile;
    setFiles([...files, fileData]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* ... (Tabs & Table Content tetap sama) ... */}

      {/* Footer Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <button className="px-8 py-2 bg-blue-500 text-white rounded-full font-medium">
          Kembali
        </button>
        {/* Update tombol ini */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full font-medium flex items-center gap-2 hover:bg-blue-50 transition-colors"
        >
          <Plus size={18} /> Tambah Materi
        </button>
      </div>

      {/* Panggil Modal */}
      <UploadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        programId={programId}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}