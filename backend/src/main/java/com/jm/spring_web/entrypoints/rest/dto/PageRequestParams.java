package com.jm.spring_web.entrypoints.rest.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class PageRequestParams {

    @Min(0)
    private int page = 0;

    @Min(1)
    @Max(100)
    private int size = 20;

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}
