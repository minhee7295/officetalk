import PostForm from "@/component/PostForm";
import useSessionUser from "@/hooks/useSessionUser";
import usePostFormHandler from "@/hooks/usePostFormHandler";
import { supabase } from "@/lib/supabase";
import { PostFormInput } from "@/inteface/item.interface";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditPage() {
  const router = useRouter();
  const { id } = router.query;
  const postId = id as string;

  const { user: sessionUser, loading: sessionLoading } = useSessionUser();
  const [initialData, setInitialData] = useState<Partial<PostFormInput>>({});
  const [loading, setLoading] = useState(true);
  const { handleSubmit } = usePostFormHandler("edit", postId);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("title, content, category, image_url")
        .eq("id", postId)
        .single();

      if (error) {
        console.error("게시글 불러오기 실패:", error);
      } else {
        setInitialData(data);
      }

      setLoading(false);
    };

    fetchPost();
  }, [postId]);

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
