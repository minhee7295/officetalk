import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { IPostData } from "../inteface/item.interface";

interface IPostTable {
  posts: IPostData[];
}

export default function PostTable({ posts }: IPostTable) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="게시글 테이블">
        <TableHead>
          <TableRow>
            <TableCell>제목</TableCell>
            <TableCell>카테고리</TableCell>
            <TableCell>내용</TableCell>
            <TableCell>작성일</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post: any) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.category}</TableCell>
              <TableCell>{post.content.slice(0, 30)}...</TableCell>
              <TableCell>
                {new Date(post.reg_dt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
