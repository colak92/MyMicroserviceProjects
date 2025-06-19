package com.techjobs.service;

import com.techjobs.model.Company;

import java.util.List;

public interface CompanyService {

    Company createCompany(Company company, String requestedRole) throws Exception;

    Company getCompanyById(Long id) throws Exception;

    List<Company> getAllCompanies();

    Company updateCompany(Long id, Company updatedCompany, Long userId) throws Exception;

    void deleteCompany(Long id) throws Exception;

}
