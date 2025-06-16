import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Comment } from "../inteface/item.interface";

// @review 마찬가지로 loading, error, refresh 등은 useSWR로 처리하는게 더 나아보임
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

  // @review 디펜던시에 fetchComments 추가
  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  return { comments, loading, error, refresh: fetchComments };
}
