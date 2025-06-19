package com.techjobs.model;

public enum JobSeniority {

    JUNIOR("Junior"),

    MEDIOR("Medior"),

    SENIOR("Senior");

    private final String label;

    // Constructor
    JobSeniority(String label) {
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
