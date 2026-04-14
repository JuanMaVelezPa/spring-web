package com.jm.spring_web.application.branch.model;

public record CreateBranchCommand(
        String code,
        String name,
        String city) {
}
