package com.techjobs.kafka.consumer;

import com.techjobs.kafka.event.ApplicantUserCreatedEvent;
import com.techjobs.model.Applicant;
import com.techjobs.service.ApplicantService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaApplicantConsumerService {

    private final ApplicantService applicantService;

    public KafkaApplicantConsumerService(ApplicantService applicantService) {
        this.applicantService = applicantService;
    }

    @KafkaListener(topics = "user.created", groupId = "applicant-service-group")
    public void consume(ApplicantUserCreatedEvent event) {
        System.out.println("📥 Received user.created event for userId: " + event.getId());

        try {
            // Only process if the role is "ROLE_APPLICANT"
            if ("ROLE_APPLICANT".equalsIgnoreCase(event.getRole())) {

                Applicant applicant = new Applicant();
                applicant.setName(event.getFullName());
                applicant.setEmail(event.getEmail());
                applicant.setUserId(event.getId());

                Applicant created = applicantService.createApplicant(applicant, event.getRole());

                System.out.println("✅ Applicant created for userId " + event.getId() + ": " + created.getId());
            } else {
                System.out.println("Ignored user.created event — role is not applicant: " + event.getRole());
            }

        } catch (Exception e) {
            System.err.println("❌ Failed to create applicant for userId " + event.getId());
            e.printStackTrace();
        }
    }
}
