import { Pagination } from "@mui/material";

interface Props {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

export default function PaginationBlock({
  currentPage,
  onPageChange,
  totalPages,
}: Props) {
  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={(_, value) => onPageChange(value)}
      shape="rounded"
      showFirstButton
      showLastButton
      sx={{ mt: 2, display: "flex", justifyContent: "center" }}
    />
  );
}
