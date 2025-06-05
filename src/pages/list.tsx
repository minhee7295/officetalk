import usePosts from "@/hooks/usePosts";
import Header from "@/component/Header";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Pagination,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

export default function ListPage() {
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const { posts, isLoading, isError } = usePosts(page, search, category);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const filteredPosts = category
    ? posts.filter((post) => post.category === category)
    : posts;

  useEffect(() => {
    const fetchTotalCount = async () => {
      const { count, error } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });

      if (!error && count !== null) setTotalCount(count);
    };
    fetchTotalCount();
  }, []);

  const totalPages = Math.ceil(totalCount / 10);
  const router = useRouter();

  return (
    <Box sx={{ flexGrow: 1, px: 4, py: 3 }}>
      <Header onSearch={handleSearch} onCategoryChange={handleCategoryChange} />

      {isLoading ? (
        <Typography>불러오는 중...</Typography>
      ) : isError ? (
        <Typography color="error">에러 발생</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>제목</TableCell>
                  <TableCell>카테고리</TableCell>
                  <TableCell>내용</TableCell>
                  <TableCell>작성일</TableCell>
                  <TableCell>댓글</TableCell>
                  <TableCell>좋아요</TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.content.slice(0, 30)}...</TableCell>
                    <TableCell>
                      {new Date(post.reg_dt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{post.comment_count}</TableCell>
                    <TableCell>{post.like_count}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
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

          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            sx={{ mt: 3, display: "flex", justifyContent: "center" }}
          />
        </>
      )}
    </Box>
  );
}
