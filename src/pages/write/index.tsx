import PostForm from "@/component/PostForm";
import usePostFormHandler from "@/hooks/usePostFormHandler";
import useSessionUser from "@/hooks/useSessionUser";

export default function WritePage() {
  const { user: sessionUser, loading } = useSessionUser();
  const { handleSubmit } = usePostFormHandler("create");

  if (loading) return <div>세션 확인 중...</div>;
  if (!sessionUser) return <div>로그인이 필요합니다.</div>;

  return (
    <PostForm mode="create" userId={sessionUser.id} onSubmit={handleSubmit} />
  );
}
