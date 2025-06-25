package com.techjobs.service;

import com.techjobs.dto.CompanyDTO;
import com.techjobs.dto.FounderDTO;
import com.techjobs.mapper.CompanyMapper;
import com.techjobs.model.Company;
import com.techjobs.model.CompanyStatus;
import com.techjobs.model.Founder;
import com.techjobs.repository.CompanyRepository;
import com.techjobs.repository.FounderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final UserClient userClient;

    private final FounderRepository founderRepository;

    public CompanyServiceImpl(
            CompanyRepository companyRepository,
            UserClient userClient,
            FounderRepository founderRepository) {
        this.companyRepository = companyRepository;
        this.userClient = userClient;
        this.founderRepository = founderRepository;
    }

    @Transactional
    @Override
    public CompanyDTO createCompany(CompanyDTO companyDTO, String requestedRole) throws Exception {
        if (!"ROLE_ADMIN".equals(requestedRole)) {
            throw new Exception("Only admin can create a company");
        }

        Company company = CompanyMapper.toEntity(companyDTO);
        company.setStatus(CompanyStatus.ACTIVE);
        company.setCreatedAt(LocalDateTime.now());

        // Save company first so it has an ID
        Company savedCompany = companyRepository.save(company);

        // Attach founders properly using repository (no detached entities)
        List<Founder> attachedFounders = attachFounders(companyDTO.getFounders(), savedCompany);
        savedCompany.setFounders(attachedFounders);

        // Save again to update founders
        companyRepository.save(savedCompany);

        return CompanyMapper.toDTO(savedCompany);
    }

    @Override
    public CompanyDTO getCompanyById(Long id) throws Exception {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new Exception("Company not found with id: " + id));
        return CompanyMapper.toDTO(company);
    }

    @Override
    public List<CompanyDTO> getAllCompanies() {
        List<Company> allCompanies = companyRepository.findAll();
        return allCompanies.stream()
                .map(CompanyMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public CompanyDTO updateCompany(Long id, CompanyDTO updatedCompanyDTO, Long userId) throws Exception {
        Company existingCompany = companyRepository.findById(id)
                .orElseThrow(() -> new Exception("Company not found"));

        // Update only non-null fields from DTO
        if (updatedCompanyDTO.getName() != null) {
            existingCompany.setName(updatedCompanyDTO.getName());
        }
        if (updatedCompanyDTO.getStatus() != null) {
            existingCompany.setStatus(updatedCompanyDTO.getStatus());
        }
        if (updatedCompanyDTO.getLogo() != null) {
            existingCompany.setLogo(updatedCompanyDTO.getLogo());
        }
        if (updatedCompanyDTO.getDescription() != null) {
            existingCompany.setDescription(updatedCompanyDTO.getDescription());
        }
        if (updatedCompanyDTO.getEmail() != null) {
            existingCompany.setEmail(updatedCompanyDTO.getEmail());
        }
        if (updatedCompanyDTO.getFoundedDate() != null) {
            existingCompany.setFoundedDate(updatedCompanyDTO.getFoundedDate());
        }

        if (updatedCompanyDTO.getFounders() != null) {
            // Get current list from DB
            List<Founder> currentFounders = founderRepository.findByCompanyId(existingCompany.getId());

            // Get IDs of incoming founders (those that should remain assigned)
            List<Long> incomingFounderIds = updatedCompanyDTO.getFounders().stream()
                    .map(FounderDTO::getId)
                    .filter(founderId -> founderId != null && founderId > 0)
                    .toList();

            // Unassigned founders that are no longer referenced
            for (Founder existingFounder : currentFounders) {
                if (!incomingFounderIds.contains(existingFounder.getId())) {
                    existingFounder.setCompany(null);
                    founderRepository.save(existingFounder);
                    founderRepository.flush();
                }
            }

            // Assign or create new founders
            for (FounderDTO founderDTO : updatedCompanyDTO.getFounders()) {
                if (founderDTO.getId() != null && founderDTO.getId() > 0) {
                    Founder founder = founderRepository.findById(founderDTO.getId())
                            .orElseThrow(() -> new Exception("Founder not found with id: " + founderDTO.getId()));

                    // Only assign if not already assigned to this company
                    if (founder.getCompany() == null || !founder.getCompany().getId().equals(existingCompany.getId())) {
                        founder.setCompany(existingCompany);
                        founderRepository.save(founder);
                        founderRepository.flush();
                    }
                } else {
                    // New founder
                    Founder newFounder = new Founder();
                    newFounder.setName(founderDTO.getName());
                    newFounder.setCompany(existingCompany);
                    founderRepository.save(newFounder);
                    founderRepository.flush();
                }
            }

            // Update the company's founder list from DB (don't replace the list, just update it in-place)
            List<Founder> updatedFounders = founderRepository.findByCompanyId(existingCompany.getId());
            existingCompany.getFounders().clear();
            existingCompany.getFounders().addAll(updatedFounders);
        }

        if (updatedCompanyDTO.getRate() != null) {
            existingCompany.setRate(updatedCompanyDTO.getRate());
        }

        Company savedCompany = companyRepository.save(existingCompany);

        return CompanyMapper.toDTO(savedCompany);
    }

    @Override
    public void deleteCompany(Long id) throws Exception {
        if (!companyRepository.existsById(id)) {
            throw new Exception("Company not found");
        }
        companyRepository.deleteById(id);
    }

    @Override
    public List<Founder> getAllFounders() {
        return founderRepository.findByCompanyIsNull();
    }

    private List<Founder> attachFounders(List<FounderDTO> founderDTOs, Company company) {
        return founderDTOs.stream().map(dto -> {
            Founder founder = founderRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Founder not found with ID: " + dto.getId()));
            founder.setCompany(company);
            return founder;
        }).collect(Collectors.toList());
    }
}
