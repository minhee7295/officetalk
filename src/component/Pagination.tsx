import { Pagination } from '@mui/material';

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
  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={(_, value) => onPageChange(value)}
      shape="rounded"
      showFirstButton
      showLastButton
      sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
    />
  );
}
