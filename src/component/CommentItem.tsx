import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Comment, SessionUser } from "../inteface/item.interface";
import useCommentActions from "@/hooks/useCommentActions";

interface CommentItemProps {
  comment: Comment;
  sessionUser: SessionUser;
  onRefresh: () => void;
}

export default function CommentItem({
  comment,
  sessionUser,
  onRefresh,
}: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { updateComment, deleteComment } = useCommentActions();

  const isOwner =
    sessionUser.id === comment.user_id || sessionUser.role === "admin";

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    try {
      await updateComment(comment.id, editContent);
      setEditing(false);
      onRefresh();
    } catch {
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;
    try {
      await deleteComment(comment.id);
      onRefresh();
    } catch {
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box sx={{ mb: 2, p: 1, borderBottom: "1px solid #eee" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">{comment.users?.nickname}</Typography>
        {isOwner && !editing && (
          <Box display="flex" gap={1}>
            <Button size="small" onClick={() => setEditing(true)}>
              수정
            </Button>
            <Button size="small" color="error" onClick={handleDelete}>
              삭제
            </Button>
          </Box>
        )}
      </Box>

      {editing ? (
        <>
          <TextField
            fullWidth
            multiline
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Box display="flex" gap={1} mt={1}>
            <Button size="small" variant="contained" onClick={handleUpdate}>
              저장
            </Button>
            <Button size="small" onClick={() => setEditing(false)}>
              취소
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
            {comment.content}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(comment.reg_dt).toLocaleString()}
          </Typography>
        </>
      )}
    </Box>
  );
}
