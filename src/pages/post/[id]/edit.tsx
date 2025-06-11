import PostForm from "@/component/PostForm";
import useSessionUser from "@/hooks/useSessionUser";
import { PostFormInput } from "@/inteface/item.interface";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user: sessionUser, loading: sessionLoading } = useSessionUser();
  const [initialData, setInitialData] = useState<Partial<PostFormInput>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("title, content, category, image_url")
        .eq("id", id)
        .single();

      if (error) {
        console.log("게시글 불러오기 실패", error);
        return;
      }

      setInitialData(data);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (data: PostFormInput) => {
    const { error } = await supabase.from("posts").update(data).eq("id", id);
    if (!error) {
      router.push(`/post/${id}`);
    } else {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  if (sessionLoading || loading) return <div>로딩 중...</div>;
  if (!sessionUser) return <div>로그인이 필요합니다.</div>;

  return (
    <PostForm
      mode="edit"
      userId={sessionUser.id}
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
}
