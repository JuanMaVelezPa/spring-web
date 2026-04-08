package com.jm.spring_web.application.branch.model;

public record UpdateBranchCommand(
        String name,
        String city) {
}
