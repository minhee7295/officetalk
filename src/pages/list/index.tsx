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

// @review 전체적으로 url 쿼리 받아서 서버사이드렌더링 요구했는데 미이행 하였음
export default function ListPage() {
  const router = useRouter();
  // @review 해당 코드 필요없음 요구사항중 url로 파라미터를 접급해서 데이터패칭을 요구 따라서 해당 상태관리 코드가 필요없음 useEffect 내 router.query로 직접적으로 접근해서 사용하면 됨
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 라우터를 여기서 받을 필요없이 usePosts 훅에서 직접적으로 router.query를 사용해서 처리하는게 더 나아보임
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

  // @review 해당 함수는 각각 컴포넌트에서 사용하고 있어서 props로 전달하는것보단 공통 함수로 분리하는게 좋음
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

  // @reivew 해당 함수는 useCallback으로 감싸는게 좋음 또한 위에 설명한것같이 쿼리스트링을 직접적으로 사용하고 있기 때문에 상태를 관리할 필요가 없음 또한 아래 3개의 함수는 모두 비슷한 구조이므로 하나의 함수로 통합할 수 있음
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

      {/* 
       // @review 삼항 연사자를 중첩으로 사용하는 것보다는 조건부 렌더링을 사용하는 것이 가독성이 좋음
       { isLoading && <Typography>불러오는 중...</Typography> }
       { error && <Typography color="error">에러 발생: {error.message}</Typography> }
       { posts.length === 0 && !isLoading && !error && }
        이런식으로 가는게 코드가 더 깔끔해짐
       */}

      {isLoading ? (
        <Typography>불러오는 중...</Typography>
      ) : error ? (
        <Typography color="error">에러 발생: {error.message}</Typography>
      ) : (
        // @review posts.length === 0 ? <Typography>게시글이 없습니다.</Typography> 처럼 조건부 렌더링을 사용하면 가독성이 더 좋아짐 또한 프라그먼트가 필요없음
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
                {/* @review 해당 컴포넌트 에서 posts가 비어있을 경우를 처리하지 않음 또한 분리 하는게 좋음 */}
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
              onPageChange={handlePageChange}
              totalCount={totalCount}
            />
          )}
        </>
      )}
    </Box>
  );
}
