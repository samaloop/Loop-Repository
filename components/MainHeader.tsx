// app/components/MainHeader.tsx
import { logout } from '@/app/auth/actions';
import { createClient } from '@/utils/supabase/server';

export default async function MainHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null; 
 
 const { data: userData, error } = await supabase
    .from('User') // Sesuaikan dengan nama di diagram
    .select('role, email')
    .eq('auth_id', user.id) // Bandingkan UUID dengan auth_id
    .single();

  const userName = user.email?.split('@')[0] || 'User';
  const role = userData?.role || 'No Role';

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 font-semibold text-lg">
            Hi, <span className="text-cyan-600 font-bold">{userName}</span>!
          </h1>
          {/* Tampilkan Role dengan styling badge */}
          <span className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
            {role}
          </span>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Repository Access</p>
        </div>

        <form action={logout}>
          <button type="submit" className="...">
             Logout →
          </button>
        </form>
      </div>
    </header>
  );
}