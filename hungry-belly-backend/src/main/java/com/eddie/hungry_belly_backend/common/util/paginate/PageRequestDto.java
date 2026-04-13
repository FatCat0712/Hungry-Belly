package com.eddie.hungry_belly_backend.common.util.paginate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageRequestDto{
    private Integer pageNum;
    private Integer pageSize;
    private String sortField;
    private String sortDirection;
    private String keyword;
}
