import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useCategories from "@/hooks/useCategories";
import { PostFormInput } from "@/inteface/item.interface";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

interface FormValues {
  title: string;
  category: string;
  content: string;
}

interface PostFormProps {
  mode: "create" | "edit";
  userId: string;
  initialData?: Partial<PostFormInput>;
  onSubmit: (data: PostFormInput) => Promise<void>;
  loading?: boolean;
}

export default function PostForm({
  mode,
  userId,
  initialData,
  onSubmit,
  loading = false,
}: PostFormProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title || "",
      category: initialData?.category || "",
      content: initialData?.content || "",
    },
  });

  const { categories, loading: categoryLoading } = useCategories();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.image_url ?? null
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    reset({
      title: initialData?.title || "",
      category: initialData?.category || "",
      content: initialData?.content || "",
    });
    setPreviewUrl(initialData?.image_url ?? null);
  }, [initialData, reset]);

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

    const ext = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${uuidv4()}.${ext}`;

    const { error } = await supabase.storage
      .from("post-images")
      .upload(fileName, imageFile, {
        upsert: true,
        contentType: imageFile.type,
      });

    setUploading(false);

    if (error) {
      console.error("이미지 업로드 실패:", error.message);
      return null;
    }

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(fileName);

    return data?.publicUrl ?? null;
  };

  const handleFinalSubmit = async (from: FormValues) => {
    const imageUrl = await uploadImageToSupabase();

    const postData = {
      ...from,
      user_id: userId,
      image_url: imageUrl ?? undefined,
    };

    await onSubmit(postData);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        게시글 {mode === "create" ? "작성" : "수정"}
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
            {...field}
            select
            fullWidth
            label="카테고리"
            margin="normal"
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

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleSubmit(handleFinalSubmit)}
          disabled={loading || uploading}
        >
          {mode === "create" ? "등록" : "수정"}
        </Button>
      </Box>
    </Box>
  );
}
