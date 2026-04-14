package com.eddie.hungry_belly_backend.common.util.paginate;

import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.function.Function;

public class PaginationUtils {
    public static Pageable buildPageable(PageRequestDto pageRequest) {
        int pageNum = pageRequest.getPageNum() != null ? pageRequest.getPageNum() : 1;
        int pageSize = pageRequest.getPageSize() != null ? pageRequest.getPageSize() : 10;

        if (pageNum <= 0 || pageSize <= 0 || pageSize > 100) {
            throw new IllegalArgumentException("Invalid pagination parameter");
        }

        String sortField = pageRequest.getSortField() != null ? pageRequest.getSortField() : "id";
        String sortDirection = pageRequest.getSortDirection() != null ? pageRequest.getSortDirection() : "asc";

        return PageRequest.of(
                pageNum - 1,
                pageSize,
                "asc".equalsIgnoreCase(sortDirection) ? Sort.by(sortField).ascending() : Sort.by(sortField).descending()
        );
    }

    public static <T,R>PageResponse<R> mapPage(Page<T> pageData, Function<T,R> mapper) {
        return PageResponse.<R>builder()
                .page(pageData.getNumber() + 1)
                .size(pageData.getSize())
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .first(pageData.isFirst())
                .last(pageData.isLast())
                .hasNext(pageData.hasNext())
                .hasPrevious(pageData.hasPrevious())
                .content(pageData.getContent().stream().map(mapper).toList())
                .build();

    }


}
