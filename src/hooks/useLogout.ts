import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

export default function useLogout() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();

    sessionStorage.removeItem("session-user");

    document.cookie = "session-user=; Max-Age=0; path=/";

    router.push("/login");
  };

  return logout;
}
