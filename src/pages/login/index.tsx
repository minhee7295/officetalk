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

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

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

    document.cookie = `session-user=${encodeURIComponent(JSON.stringify(data))}; path=/`;

    if (data.role === "admin") {
      alert("관리자 계정으로 로그인하였습니다.");
    } else {
      alert("일반 회원 로그인입니다.");
    }

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
