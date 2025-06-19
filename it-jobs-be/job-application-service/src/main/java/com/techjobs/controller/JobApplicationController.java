package com.techjobs.controller;

import com.techjobs.dto.JobApplicationRequest;
import com.techjobs.dto.JobApplicationResponse;
import com.techjobs.dto.UserDTO;
import com.techjobs.model.JobApplication;
import com.techjobs.service.JobApplicationService;
import com.techjobs.service.UserClient;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;
    private final UserClient userClient;

    public JobApplicationController(JobApplicationService jobApplicationService, UserClient userClient) {
        this.jobApplicationService = jobApplicationService;
        this.userClient = userClient;
    }

    @PostMapping
    public ResponseEntity<?> applyToJob(
            @Valid @RequestBody JobApplicationRequest request,
            @RequestHeader("Authorization") String jwt) {

        try {
            // Validate user
            UserDTO user = userClient.getUserProfile(jwt);

            if (user == null || user.getId() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user token.");
            }

            if (!"ROLE_APPLICANT".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only applicants can apply to jobs.");
            }

            if (request.getJobId() == null) {
                return ResponseEntity.badRequest().body("Job ID must be provided.");
            }

            // Log input
            System.out.println("Received job application: " + request);
            System.out.println("User: " + user.getEmail());

            // Call service
            JobApplication jobApplication = jobApplicationService.applyToJob(
                    request.getApplicantId(),
                    request.getJobId(),
                    request.getCoverLetter()
            );

            JobApplicationResponse response = new JobApplicationResponse(
                    jobApplication.getId(),
                    jobApplication.getApplicantId(),
                    jobApplication.getJobId(),
                    jobApplication.getStatus(),
                    jobApplication.getAppliedDate(),
                    jobApplication.getCoverLetter()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            JobApplication updated = jobApplicationService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobApplicationById(@PathVariable Long id) {
        try {
            JobApplication application = jobApplicationService.getJobApplicationById(id);
            return ResponseEntity.ok(application);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }

    @GetMapping
    public ResponseEntity<List<JobApplication>> getAllApplications() {
        List<JobApplication> applications = jobApplicationService.getAllJobApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/applicant/{applicantId}")
    public ResponseEntity<List<JobApplication>> getApplicationsByApplicant(@PathVariable Long applicantId) {
        List<JobApplication> applications = jobApplicationService.getJobApplicationsByApplicant(applicantId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>> getApplicationsByJob(@PathVariable Long jobId) {
        List<JobApplication> applications = jobApplicationService.getJobApplicationsByJob(jobId);
        return ResponseEntity.ok(applications);
    }
}