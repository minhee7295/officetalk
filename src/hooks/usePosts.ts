import useSWR from "swr";
import { supabase } from "@/lib/supabase";
import { IPostData } from "@/inteface/item.interface";

const fetcher = async (
  _: string,
  page: number,
  search: string,
  category: string
): Promise<IPostData[]> => {
  const from = (page - 1) * 10;
  const to = page * 10 - 1;

  let query = supabase
    .from("posts")
    .select("*, comments(id), likes(count)")
    .order("reg_dt", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data.map((post: any) => ({
    ...post,
    comment_count: post.comments?.length ?? 0,
    like_count: post.likes?.[0]?.count ?? 0,
  }));
};

export default function usePosts(
  page: number,
  search: string,
  category: string
) {
  const { data, error, isLoading } = useSWR(
    ["posts", page, search, category],
    ([, p, s, c]) => fetcher("posts", p, s, c),
    { revalidateOnFocus: true }
  );

  return {
    posts: data ?? [],
    isLoading,
    isError: error,
  };
}
