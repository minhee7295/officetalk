import { IPostData, SessionUser } from "@/inteface/item.interface";
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
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MyPage() {
  const [posts, setPosts] = useState<IPostData[]>([]);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem("session-user");
    if (!user) {
      router.push("/login");
    } else {
      try {
        const parsed: SessionUser = JSON.parse(user);
        setSessionUser(parsed);
      } catch {
        setSessionUser(null);
      }
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
        const likedPosts: IPostData[] = data
          .map((item) => item.posts?.[0] ?? item.posts)
          .filter((post): post is IPostData => post !== undefined);

        setPosts(likedPosts);
      }
    };

    fetchLikedPosts();
  }, [sessionUser]);

  if (!sessionUser) return null;

  return (
    <Box sx={{ p: 4 }}>
      <Box>
        <Button
          color="primary"
          size="small"
          variant="outlined"
          onClick={() => router.push("/list")}
        >
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
                      variant="outlined"
                      color="primary"
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
