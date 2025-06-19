package com.techjobs.controller;

import com.techjobs.dto.UserDTO;
import com.techjobs.model.Job;
import com.techjobs.service.JobService;
import com.techjobs.service.UserClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private JobService jobService;
    private UserClient userClient;

    public JobController (UserClient userClient, JobService jobService){
        this.userClient = userClient;
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job, @RequestHeader("Authorization") String jwt) throws Exception {
        UserDTO user = userClient.getUserProfile(jwt);
        Job createdJob = jobService.createJob(job, user.getRole());

        return new ResponseEntity<>(createdJob, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        Job job = jobService.getJobById(id);

        return new ResponseEntity<>(job, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Job>> getAllJobs(
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        List<Job> jobList = jobService.getAllJobs();

        return new ResponseEntity<>(jobList, HttpStatus.OK);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Job>> getJobsByCompanyId(
            @PathVariable Long companyId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        List<Job> jobs = jobService.getJobsByCompanyId(companyId);

        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @RequestBody Job oldJob,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        Job job = jobService.updateJob(id, oldJob, user.getId());

        return new ResponseEntity<>(job, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        jobService.deleteJob(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> jobExists(@PathVariable Long id) {
        boolean exists = jobService.exists(id);
        return ResponseEntity.ok(exists);
    }
}
