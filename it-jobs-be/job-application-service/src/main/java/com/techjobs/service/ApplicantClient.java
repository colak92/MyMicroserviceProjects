package com.techjobs.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "applicant-service")
public interface ApplicantClient {

    @GetMapping("/api/applicants/{id}/exists")
    boolean exists(@PathVariable("id") Long applicantId);

}
