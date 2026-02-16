import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}) => {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);

      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages - 2, currentPage + 1);

      if (currentPage <= 2) {
        start = 1;
        end = Math.min(maxVisible - 1, totalPages - 2);
      } else if (currentPage >= totalPages - 3) {
        start = Math.max(1, totalPages - maxVisible);
        end = totalPages - 2;
      }

      if (start > 1) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 2) pages.push('...');

      pages.push(totalPages - 1);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <span className="pagination-info">
        Page {currentPage + 1} of {totalPages} &middot; {startItem}–{endItem} of {totalElements}
      </span>
      <div className="pagination-controls">
        <button
          className="page-btn"
          disabled={currentPage === 0}
          onClick={() => onPageChange(0)}
          title="First page"
        >
          &laquo;
        </button>
        <button
          className="page-btn"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          title="Previous page"
        >
          &lsaquo;
        </button>

        {getPageNumbers().map((p, idx) =>
          typeof p === 'string' ? (
            <span key={`ellipsis-${idx}`} className="page-btn" style={{ border: 'none', cursor: 'default' }}>
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`page-btn ${currentPage === p ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p + 1}
            </button>
          )
        )}

        <button
          className="page-btn"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          title="Next page"
        >
          &rsaquo;
        </button>
        <button
          className="page-btn"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(totalPages - 1)}
          title="Last page"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
