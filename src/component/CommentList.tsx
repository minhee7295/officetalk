import { Box, Typography } from "@mui/material";
import CommentItem from "./CommentItem";
import { Comment } from "../inteface/item.interface";
import { SessionUser } from "@/inteface/item.interface";

interface CommentListProps {
  postId: string;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  sessionUser: SessionUser;
  comments: Comment[];
}

export default function CommentList({
  comments,
  loading,
  error,
  onRefresh,
  sessionUser,
}: CommentListProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        댓글 ({comments.length})
      </Typography>

      {loading && <Typography>댓글 불러오는 중...</Typography>}
      {error && <Typography color="error">오류: {error}</Typography>}
      {!loading && comments.length === 0 && (
        <Typography color="text.secondary">아직 댓글이 없습니다.</Typography>
      )}
      {!loading &&
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            sessionUser={sessionUser}
            onRefresh={onRefresh}
          />
        ))}
    </Box>
  );
}
