package com.techjobs.controller;

import com.techjobs.dto.UserDTO;
import com.techjobs.model.Applicant;
import com.techjobs.service.ApplicantService;
import com.techjobs.service.UserClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applicants")
public class ApplicantController {

    private final ApplicantService applicantService;
    private final UserClient userClient;

    public ApplicantController (ApplicantService applicantService, UserClient userClient){
        this.userClient = userClient;
        this.applicantService = applicantService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentApplicantProfile(@RequestHeader("Authorization") String jwt) {

        // Get user info from user-service using the JWT
        UserDTO user = userClient.getUserProfile(jwt);

        // Only proceed if user role is applicant
        if (!"ROLE_APPLICANT".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied: Not an applicant");
        }

        // Find applicant profile by user ID
        Optional<Applicant> applicant = applicantService.findByUserId(user.getId());

        if (applicant.isPresent()) {
            return ResponseEntity.ok(applicant.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Applicant profile not found");
        }
    }

    @PostMapping
    public ResponseEntity<Applicant> createApplicant(@RequestBody Applicant applicant, @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        Applicant createdApplicant = applicantService.createApplicant(applicant, user.getRole());

        return new ResponseEntity<>(createdApplicant, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Applicant> getApplicantById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        Applicant createdApplicant = applicantService.getApplicantById(id);

        return new ResponseEntity<>(createdApplicant, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Applicant>> getAllApplicants(
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        List<Applicant> applicantList = applicantService.getAllApplicants();

        return new ResponseEntity<>(applicantList, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Applicant> updateApplicant(
            @PathVariable Long id,
            @RequestBody Applicant oldApplicant,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        Applicant applicant = applicantService.updateApplicant(id, oldApplicant, user.getId());

        return new ResponseEntity<>(applicant, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplicant(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        applicantService.deleteApplicant(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> applicantExists(@PathVariable Long id) {
        boolean exists = applicantService.exists(id);
        return ResponseEntity.ok(exists);
    }
}
