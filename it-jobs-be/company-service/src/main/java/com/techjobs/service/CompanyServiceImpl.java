package com.techjobs.service;

import com.techjobs.model.Company;
import com.techjobs.model.CompanyStatus;
import com.techjobs.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {
    private CompanyRepository companyRepository;

    private JobClient jobClient;

    private UserClient userClient;

    public CompanyServiceImpl(CompanyRepository companyRepository, JobClient jobClient){
        this.companyRepository = companyRepository;
        this.jobClient = jobClient;
    }

    @Override
    public Company createCompany(Company company, String requestedRole) throws Exception {
        if (!requestedRole.equals("ROLE_ADMIN")){
            throw new Exception("Only admin can create a task");
        }

        company.setStatus(CompanyStatus.ACTIVE);
        company.setCreatedAt(LocalDateTime.now());

        return companyRepository.save(company);
    }

    @Override
    public Company getCompanyById(Long id) throws Exception {
        return companyRepository.findById(id).orElseThrow(() -> new Exception("Company not found with id: " + id));
    }

    @Override
    public List<Company> getAllCompanies() {
        List<Company> allCompanies = companyRepository.findAll();
        return allCompanies;
    }

    @Override
    public Company updateCompany(Long id, Company updatedCompany, Long userId) throws Exception {
        Company existingCompany = companyRepository.findById(id).orElseThrow(() -> new Exception("Company not found"));

        if (updatedCompany.getName() != null){
            existingCompany.setName(updatedCompany.getName());
        }

        if (updatedCompany.getStatus() != null){
            existingCompany.setStatus(updatedCompany.getStatus());
        }

        if (updatedCompany.getLogo() != null){
            existingCompany.setLogo(updatedCompany.getLogo());
        }

        if (updatedCompany.getDescription() != null){
            existingCompany.setDescription(updatedCompany.getDescription());
        }

        if (updatedCompany.getEmail() != null){
            existingCompany.setEmail(updatedCompany.getEmail());
        }

        if (updatedCompany.getFoundedDate() != null){
            existingCompany.setFoundedDate(updatedCompany.getFoundedDate());
        }

        if (updatedCompany.getFounders() != null){
            existingCompany.setFounders(updatedCompany.getFounders());
        }

        if (updatedCompany.getJobs() != null){
            existingCompany.setJobs(updatedCompany.getJobs());
        }

        if (updatedCompany.getRate() != null){
            existingCompany.setRate(updatedCompany.getRate());
        }

        return companyRepository.save(existingCompany);
    }

    @Override
    public void deleteCompany(Long id) throws Exception {
        getCompanyById(id);
        companyRepository.deleteById(id);
    }
}
