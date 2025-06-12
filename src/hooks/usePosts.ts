// /hooks/usePosts.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IPostData } from "@/inteface/item.interface";

export default function usePosts(
  page: number,
  search: string,
  category: string
) {
  const [posts, setPosts] = useState<IPostData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const from = (page - 1) * 10;
        const to = page * 10 - 1;

        let query = supabase
          .from("posts")
          .select("*, comments(id), likes(count)", { count: "exact" })
          .range(from, to)
          .order("reg_dt", { ascending: false });

        if (search) {
          query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
        }

        if (category) {
          query = query.eq("category", category);
        }

        const { data, count, error } = await query;

        if (error) throw error;

        const mapped: IPostData[] = (data ?? []).map((post) => ({
          ...post,
          comment_count: post.comments?.length ?? 0,
          like_count: post.likes?.[0]?.count ?? 0,
        }));

        setPosts(mapped);
        setTotalCount(count ?? 0);
      } catch (err) {
        console.error(err);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, search, category]);

  return { posts, totalCount, isLoading, error };
}
