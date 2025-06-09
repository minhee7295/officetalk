import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Box, Typography } from "@mui/material";
import { Comment } from "../inteface/item.interface";
import useSessionUser from "@/hooks/useSessionUser";
import CommentItem from "./CommentItem";

interface CommentListProps {
  postId: string;
  onRefresh: () => void;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const sessionUser = useSessionUser();

  const fetchComments = async () => {
    if (!postId) return;
    const { data, error } = await supabase
      .from("comments")
      .select("*, users(nickname)")
      .eq("post_id", postId)
      .order("reg_dt", { ascending: true });

    if (!error) setComments(data || []);
    setLoading(false);
  };

  useEffect(() => {
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
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            sessionUser={sessionUser}
            onRefresh={fetchComments}
          />
        ))
      )}
    </Box>
  );
}
