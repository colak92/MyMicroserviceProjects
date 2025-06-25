package com.techjobs.dto;

import com.techjobs.model.JobSeniority;
import com.techjobs.model.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDTO {
    private Long id;
    private String name;
    private JobStatus status;
    private JobSeniority seniority;
    private String description;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;
    private List<NecessarySkillDTO> necessarySkills;
    private List<AdditionalSkillDTO> additionalSkills;
    private Long companyId;
}
