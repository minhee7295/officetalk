import { supabase } from "@/lib/supabase";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CardActions,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MyPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem("session-user");
    if (!user) {
      router.push("/login");
    } else {
      setSessionUser(JSON.parse(user));
    }
  }, [router]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (!sessionUser?.id) return;

      const { data, error } = await supabase
        .from("likes")
        .select("post_id, posts(*)")
        .eq("user_id", sessionUser.id);

      if (!error && data) {
        const likedPosts = data.map((item) => item.posts);
        setPosts(likedPosts);
      }
    };

    fetchLikedPosts();
  }, [sessionUser]);

  if (!sessionUser) return null;

  return (
    <Box sx={{ p: 4 }}>
      <Box>
        <Button size="small" onClick={() => router.push("/list")}>
          뒤로가기
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom>
        내가 좋아요한 게시글
      </Typography>

      {posts.length === 0 ? (
        <Typography>좋아요한 게시글이 없습니다.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>제목</TableCell>
                <TableCell>카테고리</TableCell>
                <TableCell>작성일</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    {new Date(post.reg_dt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => router.push(`/post/${post.id}`)}
                    >
                      상세보기
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
