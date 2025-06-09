import PostForm from "@/component/PostForm";
import { SessionUser } from "@/inteface/item.interface";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function NewPostPage() {
  const [sessionUser, setSessionUser] = useState<SessionUser>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = sessionStorage.getItem("session-user");
    if (user) setSessionUser(JSON.parse(user));
    setLoading(false);
  }, []);

  if (loading) return <Typography>로딩 중...</Typography>;
  if (!sessionUser) return <Typography>로그인이 필요합니다.</Typography>;

  return <PostForm userId={sessionUser.id} />;
}
