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
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import { IPostData } from "@/inteface/item.interface";
import { useMemo, useCallback } from "react";
import PaginationBlock from "@/component/Pagination";

export default function ListPage() {
  const router = useRouter();
  const { search = "", category = "", page = "1" } = router.query;
  const currentPage = useMemo(() => {
    const parsed = parseInt(page as string, 10);
    return !isNaN(parsed) && parsed > 0 ? parsed : 1;
  }, [page]);

  const { posts, isLoading, isError, totalCount } = usePosts(
    currentPage,
    search as string,
    category as string
  );

  const totalPages = useMemo(() => Math.ceil(totalCount / 10), [totalCount]);

  const updateQuery = useCallback(
    (params: Partial<{ search: string; category: string; page: number }>) => {
      router.push({
        pathname: "/list",
        query: {
          ...router.query,
          ...params,
        },
      });
    },
    [router]
  );

  const handleQueryChange = useCallback(
    (key: "search" | "category" | "page", value: string | number) => {
      const currentValue = router.query[key]?.toString();
      const newValue = key === "page" ? Number(value) : value.toString();

      if (currentValue !== newValue.toString()) {
        updateQuery({
          [key]: newValue,
          page: key !== "page" ? 1 : (newValue as number),
        });
      }
    },
    [router.query, updateQuery]
  );

  return (
    <Box sx={{ flexGrow: 1, px: 4, py: 3 }}>
      <Header
        onSearch={(value) => handleQueryChange("search", value)}
        onCategoryChange={(value) => handleQueryChange("category", value)}
      />

      {isLoading && <Typography>불러오는 중...</Typography>}
      {!isLoading && isError && (
        <Typography color="error">에러 발생: {isError.message}</Typography>
      )}
      {!isLoading && !isError && posts.length === 0 && (
        <Typography>게시글이 없습니다.</Typography>
      )}

      {!isLoading && !isError && posts.length > 0 && (
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
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post: IPostData) => (
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

          {totalPages > 1 && (
            <PaginationBlock
              currentPage={currentPage}
              onPageChange={(page) => handleQueryChange("page", page)}
              totalPages={totalCount}
            />
          )}
        </>
      )}
    </Box>
  );
}
