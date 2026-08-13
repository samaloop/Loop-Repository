'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { unlinkProspectFromProgram } from '@/app/actions/communityPrograms';

export default function UnlinkProspectButton({ programId, prospectId, name }: { programId: number; prospectId: number; name: string }) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUnlink = async () => {
    if (!confirm(`Hapus "${name}" dari program ini? (Data calon client tidak ikut terhapus.)`)) return;

    setIsRemoving(true);
    const result = await unlinkProspectFromProgram(programId, prospectId);
    if (!result.success) {
      alert('Gagal menghapus: ' + result.error);
      setIsRemoving(false);
      return;
    }
    router.refresh();
  };

  return (
    <button onClick={handleUnlink} disabled={isRemoving} className="text-rose-500 font-bold hover:text-rose-600 text-xs disabled:opacity-50">
      {isRemoving ? 'Menghapus...' : 'Hapus dari Program'}
    </button>
  );
}
