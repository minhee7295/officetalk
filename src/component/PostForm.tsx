import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useCreatePost from "@/hooks/useCreatePost";
import { useRouter } from "next/router";
import useCategories from "@/hooks/useCategories";
import { PostFormInput } from "@/inteface/item.interface";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface PostFormProps {
  userId: string;
}

type FormValues = Pick<PostFormInput, "title" | "category" | "content">;

export default function PostForm({ userId }: PostFormProps) {
  const { createPost, loading, error } = useCreatePost();
  const { categories, loading: categoryLoading } = useCategories();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToSupabase = async (): Promise<string | null> => {
    if (!imageFile) return null;
    setUploading(true);
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error } = await supabase.storage
      .from("post-images")
      .upload(fileName, imageFile);

    setUploading(false);

    if (error) {
      console.error("이미지 업로드 실패:", error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(fileName);
    console.log("🖼️ getPublicUrl 결과:", data);
    return data?.publicUrl ?? null;
  };

  const onSubmit = async (data: FormValues) => {
    const imageUrl = await uploadImageToSupabase();

    const postData: PostFormInput = {
      ...data,
      image_url: imageUrl ?? undefined,
      userId,
    };

    const newPost = await createPost(postData);

    if (newPost) router.push(`/post/${newPost.id}`);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        게시글 작성
      </Typography>

      <Controller
        name="title"
        control={control}
        rules={{ required: "제목을 입력해주세요." }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="제목"
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />

      <Controller
        name="category"
        control={control}
        rules={{ required: "카테고리를 선택해주세요." }}
        render={({ field }) => (
          <TextField
            select
            fullWidth
            label="카테고리"
            margin="normal"
            {...field}
            error={!!errors.category}
            helperText={errors.category?.message}
          >
            {categoryLoading ? (
              <MenuItem disabled>불러오는 중...</MenuItem>
            ) : (
              categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))
            )}
          </TextField>
        )}
      />

      <Controller
        name="content"
        control={control}
        rules={{ required: "내용을 입력해주세요." }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            multiline
            rows={6}
            label="내용"
            margin="normal"
            error={!!errors.content}
            helperText={errors.content?.message}
          />
        )}
      />

      <Box mt={2}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && (
          <Box mt={1}>
            <img src={previewUrl} alt="미리보기" style={{ maxWidth: "100%" }} />
          </Box>
        )}
        {uploading && <CircularProgress size={24} />}
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={loading || uploading}
        >
          등록
        </Button>
      </Box>
    </Box>
  );
}
