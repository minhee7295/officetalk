import { useRouter } from "next/router";
import { Typography, Box, CircularProgress } from "@mui/material";
import usePostDetail from "@/hooks/usePostDetail";
import useSessionUser from "@/hooks/useSessionUser";
import PostDetailCard from "@/component/PostDetailCard";

// @review 컴포넌트 구조가 [id] 디렉토리가 있으므로 해당 디렉토리의 index.tsx 파일로 작성하는 것이 더 나아보임
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
