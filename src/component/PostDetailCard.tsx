import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Box,
  CardMedia,
  CardActions,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import usePostLike from "@/hooks/usePostLike";
import CommentList from "@/component/CommentList";
import CommentForm from "@/component/CommentForm";
import PostActions from "@/component/PostActions";
import { PostDetail } from "@/hooks/usePostDetail";
import useSessionUser from "@/hooks/useSessionUser";
import useComments from "@/hooks/useComments";

export default function PostDetailCard({ post }: { post: PostDetail }) {
  const router = useRouter();
  const { user: sessionUser } = useSessionUser();
  const likeHook = usePostLike(post.id, sessionUser?.id ?? "");
  const { comments, loading, error, refresh } = useComments(post.id);

  if (!sessionUser) return null;

  const handleDelete = async () => {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;

    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) return alert("삭제 중 오류 발생");

    alert("삭제되었습니다.");
    router.push("/list");
  };

  return (
    <Card
      sx={{
        width: 600,
        minHeight: 600,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Typography variant="h5">{post.title}</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          카테고리: {post.category} / 작성자: {post.users?.nickname}
        </Typography>
        {post.image_url && (
          <CardMedia
            component="img"
            height="300"
            image={post.image_url}
            sx={{ objectFit: "cover" }}
          />
        )}
        <Typography>{post.content}</Typography>
        <Box display="flex" alignItems="center" mt={2}>
          <IconButton
            onClick={likeHook.toggleLike}
            color={likeHook.liked ? "error" : "default"}
          >
            <FavoriteIcon />
          </IconButton>
          <Typography>{likeHook.likeCount}</Typography>
        </Box>

        <Typography variant="caption" sx={{ mt: 2 }}>
          작성일: {new Date(post.reg_dt).toLocaleString()}
        </Typography>

        <CommentList
          postId={post.id}
          comments={comments}
          loading={loading}
          error={error}
          onRefresh={refresh}
          sessionUser={sessionUser}
        />
        <CommentForm
          postId={post.id}
          userId={sessionUser.id}
          onRefresh={refresh}
        />

        {(sessionUser.id === post.user_id || sessionUser.role === "admin") && (
          <PostActions postId={post.id} onDelete={handleDelete} />
        )}
      </CardContent>
      <CardActions>
        <Button onClick={() => router.push("/list")}>뒤로가기</Button>
      </CardActions>
    </Card>
  );
}
