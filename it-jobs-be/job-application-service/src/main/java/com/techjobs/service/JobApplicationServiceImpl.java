package com.techjobs.service;

import com.techjobs.dto.JobServiceDTO;
import com.techjobs.exception.ResourceNotFoundException;
import com.techjobs.model.JobApplication;
import com.techjobs.model.JobApplicationStatus;
import com.techjobs.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;

    private final ApplicantClient applicantClient;

    private final JobClient jobClient;

    public JobApplicationServiceImpl(
            JobApplicationRepository jobApplicationRepository,
            ApplicantClient applicantClient,
            JobClient jobClient
    ){
        this.jobApplicationRepository = jobApplicationRepository;
        this.applicantClient = applicantClient;
        this.jobClient = jobClient;
    }

    @Override
    public JobApplication applyToJob(Long applicantId, Long jobId, String coverLetter) {

        if (!jobClient.exists(jobId)) {
            throw new ResourceNotFoundException("Job not found");
        }

        if (!applicantClient.exists(applicantId)) {
            throw new ResourceNotFoundException("Applicant not found");
        }

        if (jobApplicationRepository.existsByJobIdAndApplicantId(jobId, applicantId)) {
            throw new IllegalArgumentException("Already applied to this job");
        }

        JobApplication application = new JobApplication();
        application.setJobId(jobId);
        application.setApplicantId(applicantId);
        application.setStatus(JobApplicationStatus.APPLIED);
        application.setAppliedDate(LocalDateTime.now());
        application.setCoverLetter(coverLetter);

        return jobApplicationRepository.save(application);
    }

    @Override
    public JobApplication updateStatus(Long applicationId, String newStatus) {

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        try {
            JobApplicationStatus status = JobApplicationStatus.valueOf(newStatus.toUpperCase());
            application.setStatus(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }

        return jobApplicationRepository.save(application);
    }

    @Override
    public List<JobApplication> getJobApplicationsByApplicant(Long applicantId) {
        return jobApplicationRepository.findByApplicantId(applicantId);
    }

    @Override
    public List<JobApplication> getJobApplicationsByJob(Long jobId) {
        return jobApplicationRepository.findByJobId(jobId);
    }

    @Override
    public List<JobApplication> getAllJobApplications() {
        return jobApplicationRepository.findAll();
    }

    @Override
    public JobApplication getJobApplicationById(Long id) {
        return jobApplicationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    }

    @Override
    public List<JobApplication> getJobApplicationsByCompany(Long companyId, String jwt) {
        if (companyId == null) {
            return jobApplicationRepository.findAll();
        }

        List<JobServiceDTO> jobs = jobClient.getJobsByCompany(companyId, jwt);
        List<Long> jobIds = jobs.stream().map(JobServiceDTO::getId).toList();
        return jobApplicationRepository.findByJobIdIn(jobIds);
    }

}
