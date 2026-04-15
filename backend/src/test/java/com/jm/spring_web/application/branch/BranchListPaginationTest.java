package com.jm.spring_web.application.branch;

import org.junit.jupiter.api.Test;

import com.jm.spring_web.application.common.pagination.SortOrder;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BranchListPaginationTest {

    @Test
    void policyDefaultMatchesCodeAsc() {
        assertEquals(SortOrder.asc("code"), BranchListPagination.SORT_POLICY.resolve(null));
    }
}
