package com.techjobs.service;

import com.techjobs.dto.CompanyDTO;
import com.techjobs.dto.UserDTO;
import com.techjobs.model.Company;
import com.techjobs.model.Founder;

import java.util.List;
import java.util.Optional;

public interface CompanyService {

    CompanyDTO createCompany(CompanyDTO companyDTO, String requestedRole) throws Exception;

    CompanyDTO getCompanyById(Long id) throws Exception;

    List<CompanyDTO> getAllCompanies();

    CompanyDTO updateCompany(Long id, CompanyDTO updatedCompanyDTO, Long userId, String requestedRole) throws Exception;

    void deleteCompany(Long id) throws Exception;

    List<Founder> getAllFounders();

    Optional<Company> findByUserId(Long userId);

    void claimUnassignedCompanyIfExists(UserDTO user);
}
