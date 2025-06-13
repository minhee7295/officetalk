import { supabase } from "@/lib/supabase";

export default function useDeleteImage() {
  const deleteImage = async (imageUrl: string | null | undefined) => {
    if (!imageUrl) return;

    try {
      const imagePath = imageUrl.split("/post-images/")[1];
      if (!imagePath) {
        console.warn("이미지 경로 추출 실패:", imageUrl);
        return;
      }

      const { error } = await supabase.storage
        .from("post-images")
        .remove([imagePath]);

      if (error) {
        console.error("이미지 삭제 오류:", error.message);
      } else {
        console.log("이미지 삭제 성공:", imagePath);
      }
    } catch (err) {
      console.error("이미지 삭제 중 예외 발생:", err);
    }
  };

  return deleteImage;
}
