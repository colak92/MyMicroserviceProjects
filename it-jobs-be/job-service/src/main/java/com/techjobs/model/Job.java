package com.techjobs.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "job")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @Enumerated(EnumType.STRING)
    private JobSeniority seniority;

    @Lob
    @Column(name = "description", nullable = true)
    private String description;

    private LocalDateTime deadline;

    private LocalDateTime createdAt;

    @ManyToMany
    @JoinTable(
            name = "job_necessary_skill",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "necessary_skill_id")
    )
    private List<NecessarySkill> necessarySkills = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "job_additional_skill",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "additional_skill_id")
    )
    private List<AdditionalSkill> additionalSkills = new ArrayList<>();

    private Long companyId;
}
