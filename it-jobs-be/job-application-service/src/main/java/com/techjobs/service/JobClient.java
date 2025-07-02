package com.techjobs.service;

import com.techjobs.dto.JobServiceDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "job-service")
public interface JobClient {

    @GetMapping("/api/jobs/{id}/exists")
    boolean exists(@PathVariable("id") Long jobId);

    @GetMapping("/api/jobs/company/{companyId}")
    List<JobServiceDTO> getJobsByCompany(@PathVariable("companyId") Long companyId, @RequestHeader("Authorization") String jwt);

}
