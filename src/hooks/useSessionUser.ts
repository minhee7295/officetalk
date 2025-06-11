import { useEffect, useState } from "react";
import { SessionUser } from "../inteface/item.interface";

interface UseSessionUserResult {
  user: SessionUser | null;
  loading: boolean;
}

export default function useSessionUser(): UseSessionUserResult {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("session-user");
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
        }
      } catch (err) {
        console.error("세션 유저 파싱 오류:", err);
      }
    }
    setLoading(false);
  }, []);

  return { user, loading };
}
