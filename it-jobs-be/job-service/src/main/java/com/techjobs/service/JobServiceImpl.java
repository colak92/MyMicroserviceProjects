package com.techjobs.service;

import com.techjobs.model.Job;
import com.techjobs.model.JobStatus;
import com.techjobs.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobServiceImpl implements JobService {
    private JobRepository jobRepository;

    public JobServiceImpl(JobRepository jobRepository){
        this.jobRepository = jobRepository;
    }

    @Override
    public Job createJob(Job job, String requestedRole) throws Exception {
        if (!requestedRole.equals("ROLE_ADMIN")){
            throw new Exception("Only admin can create a job");
        }

        job.setStatus(JobStatus.OPEN);
        job.setCreatedAt(LocalDateTime.now());

        return jobRepository.save(job);
    }

    @Override
    public Job getJobById(Long id) throws Exception {
        return jobRepository.findById(id).orElseThrow(() -> new Exception("Job not found with id: " + id));
    }

    @Override
    public List<Job> getAllJobs() {
        List<Job> allJobs = jobRepository.findAll();
        return allJobs;
    }

    @Override
    public List<Job> getJobsByCompanyId(Long companyId) throws Exception {
        return jobRepository.findByCompanyId(companyId);
    }

    @Override
    public Job updateJob(Long id, Job updatedJob, Long userId) throws Exception {
        Job existingJob = jobRepository.findById(id).orElseThrow(() -> new Exception("Job not found"));

        if (updatedJob.getName() != null){
            existingJob.setName(updatedJob.getName());
        }

        if (updatedJob.getStatus() != null){
            existingJob.setStatus(updatedJob.getStatus());
        }

        if (updatedJob.getSeniority() != null){
            existingJob.setSeniority(updatedJob.getSeniority());
        }

        if (updatedJob.getDescription() != null){
            existingJob.setDescription(updatedJob.getDescription());
        }

        if (updatedJob.getDeadline() != null){
            existingJob.setDeadline(updatedJob.getDeadline());
        }

        if (updatedJob.getNecessarySkills() != null){
            existingJob.setNecessarySkills(updatedJob.getNecessarySkills());
        }

        if (updatedJob.getAdditionalSkills() != null){
            existingJob.setAdditionalSkills(updatedJob.getAdditionalSkills());
        }

        if (updatedJob.getCompanyId() != null){
            existingJob.setCompanyId(updatedJob.getCompanyId());
        }

        return jobRepository.save(existingJob);
    }

    @Override
    public void deleteJob(Long id) throws Exception {
        getJobById(id);
        jobRepository.deleteById(id);
    }

    @Override
    public boolean exists(Long jobId) {
        return jobRepository.existsById(jobId);
    }
}
