package com.techjobs.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/companies")
    public ResponseEntity<String> getCompanies() throws Exception {
        return new ResponseEntity<>("Welcome to company service", HttpStatus.OK);
    }
}