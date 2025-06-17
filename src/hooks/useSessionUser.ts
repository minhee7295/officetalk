import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { SessionUser } from "../inteface/item.interface";

interface UseSessionUserResult {
  user: SessionUser | null;
  loading: boolean;
}

export default function useSessionUser(): UseSessionUserResult {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = Cookies.get("session-user");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (
          parsed &&
          typeof parsed.id === "string" &&
          typeof parsed.email === "string" &&
          typeof parsed.nickname === "string" &&
          (parsed.role === "user" || parsed.role === "admin")
        ) {
          setUser(parsed);
        } else {
          console.warn("세션 유저 구조 불일치");
          router.push("/login");
        }
      } catch (err) {
        console.error("세션 유저 파싱 오류:", err);
        router.push("/login");
      }
    } else {
      router.push("/login");
    }

    setLoading(false);
  }, [router]);

  return { user, loading };
}
