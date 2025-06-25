package com.techjobs.service;

import com.techjobs.dto.JobDTO;
import com.techjobs.model.AdditionalSkill;
import com.techjobs.model.NecessarySkill;

import java.util.List;

public interface JobService {

    JobDTO createJob(JobDTO jobDTO, String requestedRole) throws Exception;

    JobDTO getJobById(Long id) throws Exception;

    List<JobDTO> getAllJobs();

    List<JobDTO> getJobsByCompanyId(Long companyId) throws Exception;

    JobDTO updateJob(Long id, JobDTO updatedJobDTO, Long userId) throws Exception;

    void deleteJob(Long id) throws Exception;

    boolean exists(Long jobId);

    List<NecessarySkill> getAllNecessarySkills();

    List<AdditionalSkill> getAllAdditionalSkills();
}
