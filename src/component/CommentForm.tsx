import { supabase } from '@/lib/supabase';
import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';

interface CommentFormProps {
  postId: string;
  userId: string;
  onRefresh: () => void;
}

export default function CommentForm({ postId, userId, onRefresh  }: CommentFormProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content) return;
    setLoading(true);
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: userId,
      content,
    });

    if (!error) {
      setContent('');
      onRefresh();
    }
    setLoading(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        label="댓글을 입력하세요"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <Box display="flex" justifyContent="flex-end" mt={1}>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          등록
        </Button>
      </Box>
    </Box>
  );
}
