package com.jm.spring_web.application.security.port;

import com.jm.spring_web.application.common.pagination.PageQuery;
import com.jm.spring_web.application.common.pagination.PageResult;
import com.jm.spring_web.application.security.model.AdminAuditLogResult;

public interface AdminAuditLogPort {
    PageResult<AdminAuditLogResult> list(PageQuery query);
}
