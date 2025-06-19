package com.techjobs.model;

public enum UserRole {

    ROLE_ADMIN("Admin"),

    ROLE_APPLICANT("Applicant"),

    ROLE_COMPANY("Company");

    private final String label;

    // Constructor
    UserRole(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    @Override
    public String toString() {
        return label;
    }
}
