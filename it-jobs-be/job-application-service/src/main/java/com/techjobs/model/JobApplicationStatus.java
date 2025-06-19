package com.techjobs.model;

public enum JobApplicationStatus {

    APPLIED("Applied"),

    INTERVIEWED("Interviewed"),

    OFFERED("Offered"),

    REJECTED("Rejected");

    private final String label;

    // Constructor
    JobApplicationStatus(String label) {
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
