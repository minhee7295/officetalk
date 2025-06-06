import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function useLogout() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();

    sessionStorage.removeItem('session-user');

    router.push('/login');
  };

  return logout;
}
