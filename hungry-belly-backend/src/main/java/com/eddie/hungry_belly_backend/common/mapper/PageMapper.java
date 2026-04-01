package com.eddie.hungry_belly_backend.common.mapper;

import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import org.springframework.data.domain.Page;

public final class PageMapper {
    private PageMapper(){};

    public static<T>PageResponse<T> toPageResponse(Page<T> page) {
        return PageResponse.<T>builder()
                .content(page.getContent())
                .page(page.getNumber() + 1)
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
}
