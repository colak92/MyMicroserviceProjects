package com.techjobs.service;

import com.techjobs.dto.JobDTO;
import com.techjobs.mapper.JobMapper;
import com.techjobs.model.AdditionalSkill;
import com.techjobs.model.Job;
import com.techjobs.model.JobStatus;
import com.techjobs.model.NecessarySkill;
import com.techjobs.repository.AdditionalSkillRepository;
import com.techjobs.repository.JobRepository;
import com.techjobs.repository.NecessarySkillRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    private final NecessarySkillRepository necessarySkillRepository;

    private final AdditionalSkillRepository additionalSkillRepository;

    public JobServiceImpl(
            JobRepository jobRepository,
            NecessarySkillRepository necessarySkillRepository,
            AdditionalSkillRepository additionalSkillRepository){

        this.jobRepository = jobRepository;
        this.necessarySkillRepository = necessarySkillRepository;
        this.additionalSkillRepository = additionalSkillRepository;
    }

    @Override
    public JobDTO createJob(JobDTO jobDTO, String requestedRole) throws Exception {
        if (!"ROLE_ADMIN".equals(requestedRole)) {
            throw new Exception("Only admin can create a job");
        }

        Job job = JobMapper.toEntity(jobDTO);
        job.setStatus(JobStatus.OPEN);
        job.setCreatedAt(LocalDateTime.now());

        Job savedJob = jobRepository.save(job);
        return JobMapper.toDTO(savedJob);
    }

    @Override
    public JobDTO getJobById(Long id) throws Exception {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new Exception("Job not found with id: " + id));
        return JobMapper.toDTO(job);
    }

    @Override
    public List<JobDTO> getAllJobs() {
        List<Job> allJobs = jobRepository.findAll();
        return allJobs.stream()
                .map(JobMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobDTO> getJobsByCompanyId(Long companyId) throws Exception {
        List<Job> jobs = jobRepository.findByCompanyId(companyId);
        return jobs.stream()
                .map(JobMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public JobDTO updateJob(Long id, JobDTO updatedJobDTO, Long userId) throws Exception {
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new Exception("Job not found"));

        if (updatedJobDTO.getName() != null) {
            existingJob.setName(updatedJobDTO.getName());
        }

        if (updatedJobDTO.getStatus() != null) {
            existingJob.setStatus(updatedJobDTO.getStatus());
        }

        if (updatedJobDTO.getSeniority() != null) {
            existingJob.setSeniority(updatedJobDTO.getSeniority());
        }

        if (updatedJobDTO.getDescription() != null) {
            existingJob.setDescription(updatedJobDTO.getDescription());
        }

        if (updatedJobDTO.getDeadline() != null) {
            existingJob.setDeadline(updatedJobDTO.getDeadline());
        }

        if (updatedJobDTO.getNecessarySkills() != null) {
            // Map DTO to entity list
            List<NecessarySkill> necessarySkills = updatedJobDTO.getNecessarySkills().stream()
                    .map(nsDto -> {
                        NecessarySkill ns = new NecessarySkill();
                        ns.setId(nsDto.getId());
                        ns.setName(nsDto.getName());
                        return ns;
                    })
                    .collect(Collectors.toList());
            existingJob.setNecessarySkills(necessarySkills);
        }

        if (updatedJobDTO.getAdditionalSkills() != null) {
            // Map DTO to entity list
            List<AdditionalSkill> additionalSkills = updatedJobDTO.getAdditionalSkills().stream()
                    .map(asDto -> {
                        AdditionalSkill as = new AdditionalSkill();
                        as.setId(asDto.getId());
                        as.setName(asDto.getName());
                        return as;
                    })
                    .collect(Collectors.toList());
            existingJob.setAdditionalSkills(additionalSkills);
        }

        if (updatedJobDTO.getCompanyId() != null) {
            existingJob.setCompanyId(updatedJobDTO.getCompanyId());
        }

        Job savedJob = jobRepository.save(existingJob);
        return JobMapper.toDTO(savedJob);
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

    @Override
    public List<NecessarySkill> getAllNecessarySkills() {
        return necessarySkillRepository.findAll();
    }

    @Override
    public List<AdditionalSkill> getAllAdditionalSkills() {
        return additionalSkillRepository.findAll();
    }
}
