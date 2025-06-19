package com.techjobs.model;

public enum JobStatus {

    OPEN("Open"),

    FILLED("Filled"),

    CLOSED("Closed");

    private final String label;

    // Constructor
    JobStatus(String label) {
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
