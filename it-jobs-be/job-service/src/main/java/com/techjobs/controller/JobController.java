package com.techjobs.controller;

import com.techjobs.dto.JobDTO;
import com.techjobs.dto.UserDTO;
import com.techjobs.model.AdditionalSkill;
import com.techjobs.model.NecessarySkill;
import com.techjobs.service.JobService;
import com.techjobs.service.UserClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final UserClient userClient;
    private final JobService jobService;

    public JobController(
            UserClient userClient,
            JobService jobService
    ) {
        this.userClient = userClient;
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<JobDTO> createJob(
            @RequestBody JobDTO jobDTO,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDTO user = userClient.getUserProfile(jwt);
        JobDTO createdJob = jobService.createJob(jobDTO, user.getRole());
        return new ResponseEntity<>(createdJob, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJobById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        userClient.getUserProfile(jwt);
        JobDTO jobDTO = jobService.getJobById(id);
        return ResponseEntity.ok(jobDTO);
    }

    @GetMapping
    public ResponseEntity<List<JobDTO>> getAllJobs(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        userClient.getUserProfile(jwt);
        List<JobDTO> jobList = jobService.getAllJobs();
        return ResponseEntity.ok(jobList);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<JobDTO>> getJobsByCompanyId(
            @PathVariable Long companyId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        userClient.getUserProfile(jwt);
        List<JobDTO> jobs = jobService.getJobsByCompanyId(companyId);
        return ResponseEntity.ok(jobs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobDTO> updateJob(
            @PathVariable Long id,
            @RequestBody JobDTO updatedJobDTO,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDTO user = userClient.getUserProfile(jwt);
        JobDTO updatedJob = jobService.updateJob(id, updatedJobDTO, user.getId());
        return ResponseEntity.ok(updatedJob);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        userClient.getUserProfile(jwt);
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> jobExists(@PathVariable Long id) {
        boolean exists = jobService.exists(id);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/necessarySkills")
    public ResponseEntity<List<NecessarySkill>> getAllNecessarySkills(
            @RequestHeader("Authorization") String jwt
    ) {
        userClient.getUserProfile(jwt);
        List<NecessarySkill> necessarySkills = jobService.getAllNecessarySkills();
        return ResponseEntity.ok(necessarySkills);
    }

    @GetMapping("/additionalSkills")
    public ResponseEntity<List<AdditionalSkill>> getAllAdditionalSkills(
            @RequestHeader("Authorization") String jwt
    ) {
        userClient.getUserProfile(jwt);
        List<AdditionalSkill> additionalSkills = jobService.getAllAdditionalSkills();
        return ResponseEntity.ok(additionalSkills);
    }
}
