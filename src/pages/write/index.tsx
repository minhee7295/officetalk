import PostForm from "@/component/PostForm";
import useSessionUser from "@/hooks/useSessionUser";
import { PostFormInput } from "@/inteface/item.interface";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

export default function WritePage() {
  const router = useRouter();
  const { user: sessionUser, loading } = useSessionUser();

  if (loading) return <div>세션 확인 중...</div>;
  if (!sessionUser) return <div>로그인이 필요합니다.</div>;

  // @review onSubmit 에대한 함수는 hooks로 분류해서 mode에 따라 분기하는게 좋음
  const handleSubmit = async (data: PostFormInput) => {
    const { error } = await supabase.from("posts").insert([data]);
    if (!error) router.push("/list");
    else alert("게시글 등록에 실패했습니다.");
  };

  return (
    <PostForm mode="create" userId={sessionUser.id} onSubmit={handleSubmit} />
  );
}
