import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";

interface PostActionsProps {
  postId: string;
  onDelete: () => void;
}

export default function PostActions({ postId, onDelete }: PostActionsProps) {
  const router = useRouter();

  return (
    <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
      <Button
        variant="outlined"
        size="small"
        onClick={() => router.push(`/edit/${postId}`)}
      >
        수정
      </Button>
      <Button variant="outlined" size="small" color="error" onClick={onDelete}>
        삭제
      </Button>
    </Box>
  );
}
