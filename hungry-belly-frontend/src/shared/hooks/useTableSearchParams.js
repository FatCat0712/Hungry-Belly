import { useSearchParams } from "react-router-dom";

function parsePositiveInt(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
}

function clampPage(page, totalItems, pageSize, fallback) {
  const safePageSize = Math.max(pageSize || 0, 1);
  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / safePageSize));
  const nextPage = parsePositiveInt(page, fallback);

  return Math.min(nextPage, totalPages);
}

export function useTableSearchParams({
  defaultPage = 1,
  defaultSortField,
  defaultSortDirection = "asc",
  defaultKeyword = "",
  pageKey = "pageNum",
  sortFieldKey = "sortField",
  sortDirectionKey = "sortDirection",
  keywordKey = "keyword",
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parsePositiveInt(searchParams.get(pageKey), defaultPage);
  const sortField = searchParams.get(sortFieldKey) || defaultSortField;
  const sortDirection =
    searchParams.get(sortDirectionKey) || defaultSortDirection;
  const keyword = searchParams.get(keywordKey) || defaultKeyword;

  const updateParams = (updates, options = {}) => {
    const { resetPage = false } = options;

    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          nextParams.delete(key);
          return;
        }

        nextParams.set(key, String(value));
      });

      if (resetPage) {
        nextParams.set(pageKey, String(defaultPage));
      }

      return nextParams;
    });
  };

  const setPage = (page, options = {}) => {
    const { totalItems, pageSize } = options;
    const nextPage =
      totalItems === undefined || pageSize === undefined
        ? parsePositiveInt(page, defaultPage)
        : clampPage(page, totalItems, pageSize, defaultPage);

    updateParams({ [pageKey]: nextPage });
  };

  return {
    currentPage,
    sortField,
    sortDirection,
    keyword,
    searchParams,
    updateParams,
    setPage,
  };
}
