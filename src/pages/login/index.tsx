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
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SessionUser>();

  const onSubmit = async (formData: SessionUser) => {
    const { email, password } = formData;
    const hashedPassword = sha256(password);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", hashedPassword)
      .maybeSingle<SessionUser>();

    if (error) {
      setError("email", { message: "로그인 중 문제가 발생했습니다." });
      return;
    }

    if (!data) {
      setError("email", {
        message: "이메일 또는 비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    sessionStorage.setItem("session-user", JSON.stringify(data));

    const { id, email: userEmail, nickname, role } = data;
    const cookieData = { id, email: userEmail, nickname, role };
    document.cookie = `session-user=${encodeURIComponent(JSON.stringify(cookieData))}; path=/; max-age=${60 * 60 * 24 * 7}`;

    alert(
      data.role === "admin"
        ? "관리자 계정으로 로그인하였습니다."
        : "일반 회원 로그인입니다."
    );
    router.push("/list");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card sx={{ minWidth: 275, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              로그인
            </Typography>

            <TextField
              label="이메일"
              fullWidth
              {...register("email", { required: "이메일을 입력해주세요." })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="비밀번호"
              type="password"
              fullWidth
              {...register("password", {
                required: "비밀번호를 입력해주세요.",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button type="submit" variant="contained" fullWidth>
              로그인
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
