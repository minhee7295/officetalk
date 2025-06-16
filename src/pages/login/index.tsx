import { SessionUser } from "@/inteface/item.interface";
import { supabase } from "@/lib/supabase";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { sha256 } from "js-sha256";
import { useRouter } from "next/router";
import React, { useState } from "react";
// @review 꼭 라이브러리 사용안해도 되고 직접적으로 유틸 만들어서 쿠기 관리해도 됨
import Cookies from "js-cookie";

export default function LoginPage() {
  // @review react-hook-form을 사용하면 더 나은 폼 관리를 할 수 있음 현재 value 체크 없이 바로 로그인 시도하는 구조
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // @review 아무리 스코프가 다르다하더라도 슈퍼베이스에서 에러를 받아오고있어서 error라는 이름은 피하는게 좋음
  const [error, setError] = useState<string>("");
  const router = useRouter();

  // @review 로그인 기능은 useCallback으로 감싸는게 좋음 또한 해당 hooks은 hooks로 분리하는게 좋음
  const handleLogin = async (): Promise<void> => {
    const pass = sha256(password);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", pass)
      .maybeSingle<SessionUser>();

    if (error) {
      setError("로그인 중 문제가 발생했습니다.");
      return;
    }

    if (!data) {
      setError("이메일 또는 비밀번호가 일치하지 않습니다.");
      return;
    }

    sessionStorage.setItem("session-user", JSON.stringify(data));
    // @review 미들웨어에서는 쿠키로 값을 보고있는데 세션에 담고있어서 미들웨어 역할을 하지 못함 쿠키에 담는것이 맞는 코드
    Cookies.set("session-user", JSON.stringify(data), { expires: 7 });
    document.cookie = `session-user=${JSON.stringify(data)}; path=/; max-age=${60 * 60 * 24 * 7}`;

    // @review 해당 코드도 괜찮지만 alert(data.role === "admin" ? "관리자 계정으로 로그인하였습니다." : "일반 회원 로그인입니다."); 로 코드를 작성하면 더 간단해질수있을것같음
    if (data.role === "admin") {
      alert("관리자 계정으로 로그인하였습니다.");
    } else {
      alert("일반 회원 로그인입니다.");
    }

    // @review 실제 서비스 에서는 console.log를 남기지 않는게 좋음
    console.log("로그인 성공:", data);

    router.push("/list");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card sx={{ minWidth: 275, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              로그인
            </Typography>
            {/* @review 엔터관련 ux 사용성 없음             */}
            <TextField
              label="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              color="primary"
              variant="contained"
              onClick={handleLogin}
              fullWidth
            >
              로그인
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
