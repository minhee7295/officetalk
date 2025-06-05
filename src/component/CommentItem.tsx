import { supabase } from "@/lib/supabase";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface CommentItemProps {
  comment: any;
  sessionUserId: string;
  onRefresh: () => void;
}

export default function CommentItem({ comment, sessionUserId, onRefresh }: CommentItemProps) {
    const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const isMyComment = sessionUserId === comment.user_id;
  const handleDelete = async () => {
    await supabase.from("comments").delete().eq("id", comment.id);
    onRefresh();
  };

  const handleUpdate = async () => {
    await supabase.from("comments").update({ content: editContent }).eq("id", comment.id);
    setEditing(false);
    onRefresh();
  };
    return (
    <Box sx={{ mb: 2, p: 1, borderBottom: "1px solid #eee" }}>
      <Typography variant="subtitle2">{comment.users?.nickname}</Typography>

      {editing ? (
        <>
          <TextField
            fullWidth
            multiline
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
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
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {comment.content}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(comment.reg_dt).toLocaleString()}
          </Typography>
        </>
      )}

      {isMyComment && !editing && (
        <Box display="flex" gap={1} mt={1}>
          <Button size="small" onClick={() => setEditing(true)}>
            수정
          </Button>
          <Button size="small" color="error" onClick={handleDelete}>
            삭제
          </Button>
        </Box>
      )}
    </Box>
  );
}