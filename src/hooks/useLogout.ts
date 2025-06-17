import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { useCallback } from "react";
import Cookies from "js-cookie";

export default function useLogout() {
  const router = useRouter();

  const logout = useCallback(async () => {
    await supabase.auth.signOut();

    sessionStorage.removeItem("session-user");

    Cookies.remove("session-user");

    router.push("/login");
  }, [router]);

  return logout;
}
