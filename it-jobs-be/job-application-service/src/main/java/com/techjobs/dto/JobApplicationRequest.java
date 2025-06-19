package com.techjobs.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobApplicationRequest {

    @NotNull
    private Long applicantId;

    @NotNull
    private Long jobId;

    @Column(length = 4000)
    private String coverLetter;
}
