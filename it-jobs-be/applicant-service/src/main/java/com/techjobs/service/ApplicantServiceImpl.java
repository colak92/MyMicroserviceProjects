package com.techjobs.service;

import com.techjobs.model.Applicant;
import com.techjobs.repository.ApplicantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicantServiceImpl implements ApplicantService {

    private final ApplicantRepository applicantRepository;

    public ApplicantServiceImpl(ApplicantRepository applicantRepository){
        this.applicantRepository = applicantRepository;
    }

    @Override
    public Applicant createApplicant(Applicant applicant, String requestedRole) throws Exception {

        if (!requestedRole.equals("ROLE_APPLICANT")) {
            throw new Exception("Only applicant can create a task");
        }

        return applicantRepository.save(applicant);
    }

    @Override
    public Applicant getApplicantById(Long id) throws Exception {
        return applicantRepository.findById(id).orElseThrow(() -> new Exception("Applicant not found with id: " + id));
    }

    @Override
    public List<Applicant> getAllApplicants() {
        return applicantRepository.findAll();
    }

    @Override
    public Applicant updateApplicant(Long id, Applicant updatedApplicant, Long userId) throws Exception {
        Applicant existingApplicant = applicantRepository.findById(id).orElseThrow(() -> new Exception("Applicant not found"));

        if (updatedApplicant.getName() != null){
            existingApplicant.setName(updatedApplicant.getName());
        }

        if (updatedApplicant.getEmail() != null){
            existingApplicant.setEmail(updatedApplicant.getEmail());
        }

        if (updatedApplicant.getResumeUrl() != null){
            existingApplicant.setResumeUrl(updatedApplicant.getResumeUrl());
        }

        if (updatedApplicant.getSkills() != null){
            existingApplicant.setSkills(updatedApplicant.getSkills());
        }

        if (updatedApplicant.getUserId() != null){
            existingApplicant.setUserId(updatedApplicant.getUserId());
        }

        return applicantRepository.save(existingApplicant);
    }

    @Override
    public void deleteApplicant(Long id) throws Exception {
        getApplicantById(id);
        applicantRepository.deleteById(id);
    }

    @Override
    public boolean exists(Long applicantId) {
        return applicantRepository.existsById(applicantId);
    }

    public Optional<Applicant> findByUserId(Long userId) {
        return applicantRepository.findByUserId(userId);
    }
}
