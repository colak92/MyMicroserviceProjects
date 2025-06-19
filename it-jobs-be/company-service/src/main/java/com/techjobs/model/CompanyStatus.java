package com.techjobs.model;

public enum CompanyStatus {

    ACTIVE("Active"),

    INACTIVE("Inactive"),

    DISSOLVED("Dissolved");

    private final String label;

    // Constructor
    CompanyStatus(String label) {
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
