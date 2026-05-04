export default function Pagination({ module, onPageChange, pageData }) {
  const totalPages = pageData?.totalPages || 1;
  const currentPage = pageData?.page || 1;
  const totalItems = pageData?.totalElements || 0;

  console.log(pageData);

  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * pageData?.size + 1;

  console.log((currentPage - 1) * pageData?.size + 1);

  const endItem = Math.min(currentPage * pageData?.size, totalItems);
  console.log(endItem);

  if (pageData?.totalElements <= pageData?.size) {
    return null;
  }

  const pageNumbers = [];
  const startPage = 1;
  const endPage = totalPages;

  for (let page = startPage; page <= endPage; page += 1) {
    pageNumbers.push(page);
  }

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">
      <small className="text-muted">
        Showing {startItem} to {endItem} of {pageData?.totalItems} {module}
      </small>

      <nav aria-label={`${module} table pagination`}>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </button>
          </li>

          {pageNumbers.map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? "active" : ""}`}
            >
              <button
                type="button"
                className="page-link"
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
