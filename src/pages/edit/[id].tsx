import useCategories from '@/hooks/useCategories';
import { PostFormInput } from '@/inteface/item.interface';
import { supabase } from '@/lib/supabase';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<PostFormInput | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { categories, loading: categoryLoading } = useCategories();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();

      if (data) {
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
        setPreviewUrl(data.image_url || null);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToSupabase = async (): Promise<string | null> => {
    if (!imageFile) return post?.image_url || null;

    setUploading(true);
    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error } = await supabase.storage.from('post-images').upload(fileName, imageFile);

    setUploading(false);

    if (error) {
      alert('이미지 업로드 실패');
      return null;
    }

    const { data } = supabase.storage.from('post-images').getPublicUrl(fileName);
    return data?.publicUrl ?? null;
  };

  const handleUpdate = async () => {
    const imageUrl = await uploadImageToSupabase();
    const { error } = await supabase
      .from('posts')
      .update({ title, content, category, image_url: imageUrl })
      .eq('id', id);

    if (error) {
      alert('수정 중 오류 발생');
    } else {
      alert('수정 완료');
      router.push(`/post/${id}`);
    }
  };

  if (loading) return <Typography>불러오는 중...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        게시글 수정
      </Typography>
      <TextField
        fullWidth
        label="제목"
        value={title}
        onChange={e => setTitle(e.target.value)}
        margin="normal"
      />
      <TextField
        select
        fullWidth
        label="카테고리"
        value={category}
        onChange={e => setCategory(e.target.value)}
        margin="normal"
      >
        {categoryLoading ? (
          <MenuItem disabled>불러오는 중...</MenuItem>
        ) : (
          categories.map(cat => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))
        )}
      </TextField>
      <TextField
        fullWidth
        label="내용"
        value={content}
        onChange={e => setContent(e.target.value)}
        multiline
        rows={6}
        margin="normal"
      />
      <Box mt={2}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && (
          <Box mt={1}>
            <img src={previewUrl} alt="미리보기" style={{ maxWidth: '100%' }} />
          </Box>
        )}
        {uploading && <Typography>이미지 업로드 중...</Typography>}
      </Box>

      <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
        <Button variant="outlined" onClick={() => router.back()}>
          취소
        </Button>
        <Button variant="contained" onClick={handleUpdate}>
          저장
        </Button>
      </Box>
    </Box>
  );
}
