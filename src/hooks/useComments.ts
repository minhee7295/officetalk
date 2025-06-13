import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Comment } from "../inteface/item.interface";

export default function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select("*, users(nickname)")
        .eq("post_id", postId)
        .order("reg_dt", { ascending: true });

      if (error) throw error;
      setComments(data ?? []);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("알 수 없는 에러가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  return { comments, loading, error, refresh: fetchComments };
}
