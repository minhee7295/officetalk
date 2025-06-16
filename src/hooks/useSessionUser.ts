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
    // @review 쿠키로 가져오는게 더 나아보임 또한 세션구조가 불일치하면 올바른 로그인이 아니므로 콘솔을 찍는게 아니라 로그인 페이지로 보내는게 맞아보임, 또한 어차피 로그인 정보가 안맞으면 미들웨어에서 로그인페이지 보내버리고있음 방어코드면 괜찮을것같음
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
