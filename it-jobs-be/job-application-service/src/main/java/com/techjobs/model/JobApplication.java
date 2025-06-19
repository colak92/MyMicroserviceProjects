package com.techjobs.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "job_application")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long jobId;

    private Long applicantId;

    @Enumerated(EnumType.STRING)
    private JobApplicationStatus status;

    private LocalDateTime appliedDate;

    @Column(length = 4000)
    private String coverLetter;
}
