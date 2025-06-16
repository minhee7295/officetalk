import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  CardActions,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useCategories from "@/hooks/useCategories";
import { PostFormInput } from "@/inteface/item.interface";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import useDeleteImage from "@/hooks/useDeleteImage";

interface FormValues {
  title: string;
  category: string;
  content: string;
}

/* 
  @review 여기서 mode의 기능이 모호함 initialData가 있을때는 edit로, 없을때는 create로 처리하는게 좋음
  코드내에 const isEditMode = !!initialData; 와 같이 변수를 만들어서 사용하면 가독성이 좋아짐
*/
interface PostFormProps {
  mode: "create" | "edit";
  userId: string;
  initialData?: Partial<PostFormInput>;
  onSubmit: (data: PostFormInput) => Promise<void>;
  loading?: boolean;
}

// @review 컴포넌트가 너무 길어지면 가독성이 떨어지므로 각 기능별로 컴포넌트를 분리하는게 좋음 예를들어 이미지 업로드 컴포넌트, 폼 컴포넌트 등으로 나누는것이 좋음
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
  const router = useRouter();

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

  const deleteImage = useDeleteImage();
  const handleImageDelete = async () => {
    if (previewUrl && initialData?.image_url === previewUrl) {
      await deleteImage(previewUrl);
    }

    setImageFile(null);
    setPreviewUrl(null);
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
      image_url: previewUrl === null ? undefined : (imageUrl ?? undefined),
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
            {/* nextjs 에서는 Image 를 사용해서 이미지 최적화 필요 */}
            <img
              src={previewUrl}
              alt="미리보기"
              style={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain" }}
            />
            {/* @review 이미지 삭제하고 저장하면 이미지 디비에서는 삭제안되서 남아있음 */}
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={handleImageDelete}
            >
              이미지 삭제
            </Button>
          </Box>
        )}
        {uploading && <CircularProgress size={24} />}
      </Box>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit(handleFinalSubmit)}
          disabled={loading || uploading}
        >
          {mode === "create" ? "등록" : "수정"}
        </Button>
      </Box>
      <CardActions>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => router.push("/list")}
        >
          뒤로가기
        </Button>
      </CardActions>
    </Box>
  );
}
