import { PostFormInput } from "@/inteface/item.interface";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

export default function usePostFormHandler(
  mode: "create" | "edit",
  postId?: string
) {
  const router = useRouter();

  const handleSubmit = async (data: PostFormInput) => {
    const table = supabase.from("posts");
    let error;

    if (mode === "create") {
      ({ error } = await table.insert([data]));
    } else if (mode === "edit" && postId) {
      ({ error } = await table.update(data).eq("id", postId));
    }

    if (!error) {
      router.push(mode === "create" ? "/list" : `/post/${postId}`);
    } else {
      alert(`게시글 ${mode === "create" ? "등록" : "수정"}에 실패했습니다.`);
      console.error(error);
    }
  };

  return { handleSubmit };
}
