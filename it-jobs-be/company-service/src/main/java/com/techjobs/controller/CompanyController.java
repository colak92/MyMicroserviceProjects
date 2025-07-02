package com.techjobs.controller;

import com.techjobs.dto.CompanyDTO;
import com.techjobs.dto.UserDTO;
import com.techjobs.mapper.CompanyMapper;
import com.techjobs.model.Company;
import com.techjobs.model.Founder;
import com.techjobs.service.CompanyService;
import com.techjobs.service.UserClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;
    private final UserClient userClient;

    public CompanyController(UserClient userClient, CompanyService companyService) {
        this.userClient = userClient;
        this.companyService = companyService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentCompanyProfile(@RequestHeader("Authorization") String jwt) {
        UserDTO user = userClient.getUserProfile(jwt);

        if (!"ROLE_COMPANY".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Not a company");
        }

        // Try to auto-claim any matching unclaimed company
        companyService.claimUnassignedCompanyIfExists(user);

        Optional<Company> company = companyService.findByUserId(user.getId());

        if (company.isPresent()) {
            CompanyDTO companyDTO = CompanyMapper.toDTO(company.get());
            return ResponseEntity.ok(companyDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Company profile not found");
        }

    }

    @PostMapping
    public ResponseEntity<CompanyDTO> createCompany(@RequestBody CompanyDTO companyDTO,
                                                    @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        CompanyDTO createdCompany = companyService.createCompany(companyDTO, user.getRole());

        return new ResponseEntity<>(createdCompany, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDTO> getCompanyById(@PathVariable Long id,
                                                     @RequestHeader("Authorization") String jwt) throws Exception {

        // authorization check if needed
        userClient.getUserProfile(jwt);
        CompanyDTO companyDTO = companyService.getCompanyById(id);

        return new ResponseEntity<>(companyDTO, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<CompanyDTO>> getAllCompanies(@RequestHeader("Authorization") String jwt) throws Exception {

        userClient.getUserProfile(jwt);
        List<CompanyDTO> companies = companyService.getAllCompanies();

        return new ResponseEntity<>(companies, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyDTO> updateCompany(@PathVariable Long id,
                                                    @RequestBody CompanyDTO companyDTO,
                                                    @RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO user = userClient.getUserProfile(jwt);
        CompanyDTO updatedCompany = companyService.updateCompany(id, companyDTO, user.getId(), user.getRole());

        return new ResponseEntity<>(updatedCompany, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id,
                                              @RequestHeader("Authorization") String jwt) throws Exception {

        userClient.getUserProfile(jwt);
        companyService.deleteCompany(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/founders")
    public ResponseEntity<List<Founder>> getAllFounders(@RequestHeader("Authorization") String jwt) {
        userClient.getUserProfile(jwt);
        List<Founder> founders = companyService.getAllFounders();
        return ResponseEntity.ok(founders);
    }
}