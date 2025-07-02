package com.techjobs.service;

import com.techjobs.model.JobApplication;

import java.util.List;

public interface JobApplicationService {

    JobApplication applyToJob(Long applicantId, Long jobId, String coverLetter);

    JobApplication updateStatus(Long applicationId, String newStatus);

    List<JobApplication> getJobApplicationsByApplicant(Long applicantId);

    List<JobApplication> getJobApplicationsByJob(Long jobId);

    List<JobApplication> getAllJobApplications();

    JobApplication getJobApplicationById(Long id);

    List<JobApplication> getJobApplicationsByCompany(Long companyId, String jwt);

}
