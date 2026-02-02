// app/components/MainHeader.tsx
import { logout } from '@/app/auth/actions';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link'; //
import { Home } from 'lucide-react'; // Menggunakan Lucide untuk konsistensi ikon

export default async function MainHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null; 

  const { data: userData } = await supabase
    .from('User')
    .select('role, email')
    .eq('auth_id', user.id)
    .single();

  const userName = user.email?.split('@')[0] || 'User';
  const role = userData?.role || 'No Role';

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* SISI KIRI: Sapaan & Role */}
        <div className="flex items-center gap-4">
          {/* Opsional: Logo kecil atau inisial aplikasi bisa ditaruh di sini */}
          <div className="flex flex-col">
            <h1 className="text-gray-800 font-semibold text-lg leading-tight">
              Hi, <span className="text-cyan-600 font-bold">{userName}</span>!
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                {role}
              </span>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Repository Access</p>
            </div>
          </div>
        </div>

        {/* SISI KANAN: Navigasi & Logout */}
        <div className="flex items-center gap-4 md:gap-8">
          
          {/* SHORTCUT HOME/DASHBOARD */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 transition-all font-bold text-sm group"
          >
            <div className="p-2 bg-slate-50 group-hover:bg-cyan-50 rounded-xl transition-colors">
              <Home size={18} strokeWidth={2.5} />
            </div>
            <span className="hidden sm:inline">Home</span>
          </Link>

          {/* TOMBOL LOGOUT */}
          <form action={logout}>
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-5 py-2.5 rounded-2xl text-xs font-black transition-all border border-rose-100/50 shadow-sm shadow-rose-50"
            >
              Logout
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
            </button>
          </form>

        </div>
      </div>
    </header>
  );
}