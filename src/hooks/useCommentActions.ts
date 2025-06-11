import { supabase } from "@/lib/supabase";
import { Comment } from "../inteface/item.interface";

export default function useCommentActions() {
  const createComment = async (
    input: Pick<Comment, "post_id" | "user_id" | "content">
  ) => {
    const { error } = await supabase.from("comments").insert(input);
    if (error) throw error;
  };

  const updateComment = async (id: string, content: string) => {
    const { error } = await supabase
      .from("comments")
      .update({ content })
      .eq("id", id);
    if (error) throw error;
  };

  const deleteComment = async (id: string) => {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) throw error;
  };

  return {
    createComment,
    updateComment,
    deleteComment,
  };
}
