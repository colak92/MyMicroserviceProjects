package com.techjobs.service;

import com.techjobs.model.Job;
import com.techjobs.model.JobStatus;

import java.util.List;

public interface JobService {

    Job createJob(Job job, String requestedRole) throws Exception;

    Job getJobById(Long id) throws Exception;

    List<Job> getAllJobs();

    List<Job> getJobsByCompanyId(Long companyId) throws  Exception;

    Job updateJob(Long id, Job updatedJob, Long userId) throws Exception;

    void deleteJob(Long id) throws Exception;

    boolean exists(Long jobId);
}
