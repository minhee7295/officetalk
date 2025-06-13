import { IPostData } from "@/inteface/item.interface";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export interface PostDetail extends IPostData {
  users?: { nickname: string };
  user_id: string;
  image_url: string;
}

export default function usePostDetail(id?: string) {
  const [data, setData] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*, users(nickname)")
          .eq("id", id)
          .single();
        if (error) throw error;
        setData(data);
      } catch {
        setError("게시글을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  return { data, loading, error };
}
