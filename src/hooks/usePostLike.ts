import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function usePostLike(postId: string, userId?: string) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    if (postId) fetchLikeInfo();
  }, [postId, userId]);

  const fetchLikeInfo = async () => {
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);
    setLikeCount(count || 0);

    if (userId) {
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .maybeSingle();
      setLiked(!!data);
    }
  };

  const toggleLike = async () => {
    if (!userId) return;

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("post_id", postId);
      //@review 해당 코드는 그럼 맨처음 가져온 좋아요의 갯수에서만 -1 이되어서 동시성이 가능한건지?
      await supabase
        .from("posts")
        .update({ like_count: likeCount - 1 })
        .eq("id", postId);
    } else {
      const { error } = await supabase
        .from("likes")
        .insert({ user_id: userId, post_id: postId });
      if (!error || error.code === "23505") {
        await supabase
          .from("posts")
          .update({ like_count: likeCount + 1 })
          .eq("id", postId);
      }
    }

    fetchLikeInfo();
  };

  return { liked, likeCount, toggleLike };
}
