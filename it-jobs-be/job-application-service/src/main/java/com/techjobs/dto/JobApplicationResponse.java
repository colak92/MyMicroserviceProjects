package com.techjobs.dto;

import com.techjobs.model.JobApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobApplicationResponse {

    private Long id;
    private Long applicantId;
    private Long jobId;
    private JobApplicationStatus status;
    private LocalDateTime appliedDate;
    private String coverLetter;

}
