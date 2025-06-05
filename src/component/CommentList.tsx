import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Box, Typography } from "@mui/material";

interface CommentListProps {
  postId: string | string[] | undefined;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, users(nickname)")
        .eq("post_id", postId)
        .order("reg_dt", { ascending: true });

      if (!error) setComments(data || []);
      setLoading(false);
    };

    fetchComments();
  }, [postId]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        댓글 ({comments.length})
      </Typography>

      {loading ? (
        <Typography>댓글 불러오는 중...</Typography>
      ) : comments.length === 0 ? (
        <Typography color="text.secondary">아직 댓글이 없습니다.</Typography>
      ) : (
        comments.map((c) => (
          <Box key={c.id} sx={{ mb: 2, p: 1, borderBottom: "1px solid #eee" }}>
            <Typography variant="subtitle2">{c.users?.nickname}</Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {c.content}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(c.reg_dt).toLocaleString()}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
}
