import useCommentActions from "@/hooks/useCommentActions";
import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";

interface CommentFormProps {
  postId: string;
  userId: string;
  onRefresh: () => void;
}

export default function CommentForm({
  postId,
  userId,
  onRefresh,
}: CommentFormProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { createComment } = useCommentActions();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await createComment({ post_id: postId, user_id: userId, content });
      setContent("");
      onRefresh();
    } catch {
      alert("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        label="댓글을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Box display="flex" justifyContent="flex-end" mt={1}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          color="primary"
        >
          등록
        </Button>
      </Box>
    </Box>
  );
}
