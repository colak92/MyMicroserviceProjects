package com.techjobs.controller;

import com.techjobs.dto.UserDTO;
import com.techjobs.model.Company;
import com.techjobs.service.CompanyService;
import com.techjobs.service.UserClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    private CompanyService companyService;

    private UserClient userClient;

    public CompanyController (UserClient userClient, CompanyService companyService){
        this.userClient = userClient;
        this.companyService = companyService;
    }

    @PostMapping
    public ResponseEntity<Company> createCompany(@RequestBody Company company, @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        Company createdCompany = companyService.createCompany(company, user.getRole());

        return new ResponseEntity<>(createdCompany, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        Company company = companyService.getCompanyById(id);

        return new ResponseEntity<>(company, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Company>> getAllCompanies(
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        List<Company> companyList = companyService.getAllCompanies();

        return new ResponseEntity<>(companyList, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(
            @PathVariable Long id,
            @RequestBody Company oldCompany,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        Company company = companyService.updateCompany(id, oldCompany, user.getId());

        return new ResponseEntity<>(company, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        companyService.deleteCompany(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
