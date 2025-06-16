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
  // @review useState 사용시 set에 이름 같이 사용하는게 좋음 ex) setIsLoading
  const [isLoading, setLoading] = useState<boolean>(true);
  // @review supabase에서 error로 받아오고있어서 명칭 수정 필요
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

        /*
        @review setError 가 있어서 error가 있어서 throw 에러로 가서 캐치로 잡히는것보단
        아래코드로 처리하는게 더 명확함
        if (error) {
          setError(error);
          return;
        }
        */
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
        // @review setError에 error 담는건 기존 자기의 에러를 담는거라서 캐치에서 받은 err를 받아야하는 맞음 슈퍼베이스 에러를 받으려면 스코프가 맞지 않음
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    // @review 의존성 배열에 error 넣어야할듯
  }, [page, search, category]);

  return { posts, totalCount, isLoading, error };
}
