import { Pagination } from "@mui/material";

interface Props {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  perPage?: number;
}

export default function PaginationBlock({
  currentPage,
  onPageChange,
  totalCount,
  perPage = 10,
}: Props) {
  // @review 상위에서 totalPages 전달 받고있는데 다시 계산해서 통일할 필요가 있음
  const totalPages = Math.ceil(totalCount / perPage);

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
