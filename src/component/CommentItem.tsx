import { supabase } from "@/lib/supabase";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Comment, SessionUser } from "../inteface/item.interface";

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
  const isMyComment = sessionUser.id === comment.user_id;
  const isAdmin = sessionUser.role === "admin";
  const handleDelete = async () => {
    await supabase.from("comments").delete().eq("id", comment.id);
    onRefresh();
  };

  const handleUpdate = async () => {
    await supabase
      .from("comments")
      .update({ content: editContent })
      .eq("id", comment.id);
    setEditing(false);
    onRefresh();
  };
  return (
    <Box sx={{ mb: 2, p: 1, borderBottom: "1px solid #eee" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">{comment.users?.nickname}</Typography>

        {(isMyComment || isAdmin) && !editing && (
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
