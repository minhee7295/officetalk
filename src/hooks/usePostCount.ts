import useSWR from "swr";
import { supabase } from "@/lib/supabase";

const fetchCount = async (
  search: string,
  category: string
): Promise<number> => {
  let query = supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { count, error } = await query;

  if (error || count === null) throw error;
  return count;
};

export default function usePostCount(search: string, category: string) {
  const { data, error, isLoading } = useSWR(
    ["post-count", search, category],
    () => fetchCount(search, category)
  );

  return {
    totalCount: data ?? 0,
    isLoading,
    isError: error,
  };
}
