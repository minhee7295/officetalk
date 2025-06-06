import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CommentList from '@/component/CommentList';
import CommentForm from '@/component/CommentForm';
import FavoriteIcon from '@mui/icons-material/Favorite';
import usePostLike from '@/hooks/usePostLike';
import PostActions from '@/component/PostActions';
import { SessionUser } from '@/inteface/item.interface';

export default function DetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const user = sessionStorage.getItem('session-user');
    if (user) setSessionUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, users(nickname)')
        .eq('id', id)
        .single();

      if (!error) setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  const likeHook = usePostLike(post?.id ?? '', sessionUser?.id ?? '');

  if (!post || !sessionUser) return <Typography>로딩 중...</Typography>;

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ maxWidth: 600 }}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {post.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              카테고리: {post.category} / 작성자: {post.users?.nickname}
            </Typography>
            {post.image_url && (
              <CardMedia component="img" height="300" image={post.image_url} alt={post.title} />
            )}
            <Typography variant="body1">{post.content}</Typography>

            {likeHook && (
              <Box display="flex" alignItems="center" mt={2}>
                <IconButton
                  onClick={likeHook.toggleLike}
                  color={likeHook.liked ? 'error' : 'default'}
                >
                  <FavoriteIcon />
                </IconButton>
                <Typography>{likeHook.likeCount}</Typography>
              </Box>
            )}

            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
              작성일: {new Date(post.reg_dt).toLocaleString()}
            </Typography>
            <CommentList postId={id as string} onRefresh={handleRefresh}  />
            {sessionUser && <CommentForm postId={post.id} userId={sessionUser.id} onRefresh={handleRefresh} />}

            {(sessionUser?.id === post.user_id || sessionUser?.role === 'admin') && (
              <PostActions
                postId={post.id}
                onDelete={async () => {
                  const confirm = window.confirm('정말 삭제하시겠습니까?');
                  if (!confirm) return;

                  const { error } = await supabase.from('posts').delete().eq('id', post.id);
                  if (error) {
                    alert('삭제 중 오류 발생');
                  } else {
                    alert('삭제되었습니다.');
                    router.push('/list');
                  }
                }}
              />
            )}
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" onClick={() => router.push('/list')}>
            뒤로가기
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
