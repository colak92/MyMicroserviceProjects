package com.techjobs.service;

import com.techjobs.model.Applicant;

import java.util.List;
import java.util.Optional;

public interface ApplicantService {

    Applicant createApplicant(Applicant applicant, String requestedRole) throws Exception;

    Applicant getApplicantById(Long id) throws Exception;

    List<Applicant> getAllApplicants();

    Applicant updateApplicant(Long id, Applicant updatedApplicant, Long userId) throws Exception;

    void deleteApplicant(Long id) throws Exception;

    boolean exists(Long applicantId);

    Optional<Applicant> findByUserId(Long userId);
}
