type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizes: number[];
  start: number;
  end: number;
  total: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  pageSizes,
  start,
  end,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  function getPageNumbers() {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    // Always show:
    // 1
    // current page
    // page before current
    // page after current
    // last page

    const pages = new Set([
      1,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      totalPages,
    ]);

    const sortedPages = [...pages]
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b);

    const result: (number | "...")[] = [];

    for (let i = 0; i < sortedPages.length; i++) {
      const page = sortedPages[i];
      const previousPage = sortedPages[i - 1];

      // If there is a gap, show ...
      if (previousPage && page - previousPage > 1) {
        result.push("...");
      }

      result.push(page);
    }

    return result;
  }

  const pageNumbers = getPageNumbers();

  return (
    <footer className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          Showing {start}-{end} of {total}
        </span>

        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded border px-2 py-1 text-gray-900"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>

      <nav className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded border px-3 py-1.5 disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>

        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`rounded border px-3 py-1.5 cursor-pointer ${
                page === currentPage ? "bg-indigo-600 text-white" : ""
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded border px-3 py-1.5 disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </nav>
    </footer>
  );
}
