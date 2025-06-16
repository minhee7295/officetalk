import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

// @review 해당 hooks 패치 관련해서는 빼서 사용한것은 좋았으니 좀 더 명확하게 하기 위해서 hooks 보단 fetch로 이름을 변경하는게 좋음 또한 다른 데이터 패칭도 해당처럼 따로 관심사로 해서 나누는게 좋음
export default function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  /* @review 로딩 상태 swr 있으므로 불필요 swr로 처리 하는게 더 나아보임
    사용 예 
    const { data: todos, error, isLoading } = useSWR('categories', useCategories);
    useCategoriesFetch -> useCategories.swr.ts ->  컴포넌트에서 데이터 불러오는 방식? 정도
  */
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      // @
      const { data, error } = await supabase.from("posts").select("category");

      if (!error && data) {
        const itemCategory = Array.from(
          new Set(data.map((item) => item.category))
        );
        setCategories(itemCategory);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return { categories, loading };
}
