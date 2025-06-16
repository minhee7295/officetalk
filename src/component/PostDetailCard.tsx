import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Box,
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
import { SessionUser } from "@/inteface/item.interface";
import useComments from "@/hooks/useComments";
import useDeleteImage from "@/hooks/useDeleteImage";
import Image from "next/image";

// @review 관심사 분리를 위해 interface를 따로 분리하는게 좋음
interface PostDetailCardProps {
  post: PostDetail;
  sessionUser: SessionUser;
}

export default function PostDetailCard({
  post,
  sessionUser,
}: PostDetailCardProps) {
  const router = useRouter();
  const likeHook = usePostLike(post.id, sessionUser.id);
  const { comments, loading, error, refresh } = useComments(post.id);

  const deleteImage = useDeleteImage();

  // @review 해당 함수는 useCallback으로 감싸는게 좋음 또한 hooks로 분리하는게 좋음
  const handleDelete = async () => {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;

    if (post.image_url) await deleteImage(post.image_url);

    await supabase.from("comments").delete().eq("post_id", post.id);
    await supabase.from("likes").delete().eq("post_id", post.id);

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
          <Box mt={2}>
            {/* @review MUI Box 컴포넌트 대신 Next.js의 Image 컴포넌트를 사용하여 이미지 최적화 next.config.ts 에 설정 추가해야함 */}
            <Image
              src={post.image_url}
              alt="게시글 이미지"
              width={600}
              height={300}
              style={{
                maxWidth: "100%",
                maxHeight: 300,
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
            {/* <Box
              component="img"
              src={post.image_url}
              alt="게시글 이미지"
              sx={{
                maxWidth: "100%",
                maxHeight: 300,
                objectFit: "contain",
                borderRadius: 1,
              }}
            /> */}
          </Box>
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
        <Button
          color="primary"
          variant="outlined"
          onClick={() => router.push("/list")}
        >
          뒤로가기
        </Button>
      </CardActions>
    </Card>
  );
}
