import { useRouter } from "next/router";
import { Typography, Box, CircularProgress } from "@mui/material";
import usePostDetail from "@/hooks/usePostDetail";
import useSessionUser from "@/hooks/useSessionUser";
import PostDetailCard from "@/component/PostDetailCard";

export default function DetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: post,
    loading: postLoading,
    error,
  } = usePostDetail(id as string);
  const { user: sessionUser, loading: sessionLoading } = useSessionUser();

  if (sessionLoading) return <div>세션 로딩 중...</div>;
  if (!sessionUser) return <div>로그인이 필요합니다.</div>;
  if (postLoading) return <CircularProgress />;
  if (error || !post)
    return <Typography>게시글을 불러올 수 없습니다.</Typography>;

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <PostDetailCard post={post} sessionUser={sessionUser} />
    </Box>
  );
}
