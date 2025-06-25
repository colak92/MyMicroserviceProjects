package com.techjobs.service;

import com.techjobs.dto.CompanyDTO;
import com.techjobs.model.Founder;

import java.util.List;

public interface CompanyService {

    CompanyDTO createCompany(CompanyDTO companyDTO, String requestedRole) throws Exception;

    CompanyDTO getCompanyById(Long id) throws Exception;

    List<CompanyDTO> getAllCompanies();

    CompanyDTO updateCompany(Long id, CompanyDTO updatedCompanyDTO, Long userId) throws Exception;

    void deleteCompany(Long id) throws Exception;

    List<Founder> getAllFounders();

}
