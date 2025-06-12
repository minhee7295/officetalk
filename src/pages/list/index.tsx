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
import { useEffect, useState, useMemo } from "react";
import PaginationBlock from "@/component/Pagination";

export default function ListPage() {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 쿼리스트링에서 상태 동기화
  useEffect(() => {
    const { search = "", category = "", page = "1" } = router.query;

    setSearch(search as string);
    setCategory(category as string);

    const parsed = parseInt(page as string, 10);
    setCurrentPage(!isNaN(parsed) && parsed > 0 ? parsed : 1);
  }, [router.query]);

  const { posts, isLoading, error, totalCount } = usePosts(
    currentPage,
    search,
    category
  );

  const totalPages = useMemo(() => Math.ceil(totalCount / 10), [totalCount]);

  const updateQuery = (
    params: Partial<{ search: string; category: string; page: number }>
  ) => {
    router.push({
      pathname: "/list",
      query: {
        ...router.query,
        ...params,
      },
    });
  };

  const handleSearch = (value: string) => {
    if (value !== search) {
      updateQuery({ search: value, page: 1 });
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value !== category) {
      updateQuery({ category: value, page: 1 });
    }
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      updateQuery({ page });
    }
  };

  return (
    <Box sx={{ flexGrow: 1, px: 4, py: 3 }}>
      <Header onSearch={handleSearch} onCategoryChange={handleCategoryChange} />

      {isLoading ? (
        <Typography>불러오는 중...</Typography>
      ) : error ? (
        <Typography color="error">에러 발생: {error.message}</Typography>
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
              onPageChange={handlePageChange}
              totalCount={totalCount}
            />
          )}
        </>
      )}
    </Box>
  );
}
