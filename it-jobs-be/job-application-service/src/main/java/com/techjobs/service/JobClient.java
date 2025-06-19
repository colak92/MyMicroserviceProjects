package com.techjobs.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "job-service")
public interface JobClient {

    @GetMapping("/api/jobs/{id}/exists")
    boolean exists(@PathVariable("id") Long jobId);

}
