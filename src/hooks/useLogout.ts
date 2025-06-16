import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

export default function useLogout() {
  const router = useRouter();

  // @review 로그아웃할때 미들웨어를 사용해서 쿠키도 지워야함 또한 해당코드는 메모이제이션이 되지 않아서 매번 새로 생성됨 useCallback을 사용해서 메모이제이션을 하는게 좋음
  const logout = async () => {
    await supabase.auth.signOut();

    sessionStorage.removeItem("session-user");

    router.push("/login");
  };

  return logout;
}
