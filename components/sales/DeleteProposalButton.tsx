'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProposal } from '@/app/actions/proposals';

export default function DeleteProposalButton({ id, companyId, label }: { id: number; companyId: number; label: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Hapus proposal "${label}"?`)) return;

    setIsDeleting(true);
    const result = await deleteProposal(id, companyId);
    if (!result.success) {
      alert('Gagal menghapus: ' + result.error);
      setIsDeleting(false);
      return;
    }
    router.push('/sales/proposals');
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-6 py-3 rounded-2xl text-sm font-black transition-all border border-rose-100/50 disabled:opacity-50"
    >
      {isDeleting ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}
