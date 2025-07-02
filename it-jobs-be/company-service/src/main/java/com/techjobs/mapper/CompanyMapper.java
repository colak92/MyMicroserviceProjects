package com.techjobs.mapper;

import com.techjobs.dto.CompanyDTO;
import com.techjobs.dto.FounderDTO;
import com.techjobs.model.Company;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class CompanyMapper {

    // Entity -> DTO
    public static CompanyDTO toDTO(Company company) {
        if (company == null) return null;

        List<FounderDTO> founderDTOs = company.getFounders() == null ?
                Collections.emptyList() :
                company.getFounders().stream()
                        .map(f -> new FounderDTO(f.getId(), f.getName()))
                        .collect(Collectors.toList());

        return new CompanyDTO(
                company.getId(),
                company.getName(),
                company.getStatus(),
                company.getLogo(),
                company.getDescription(),
                company.getEmail(),
                company.getFoundedDate(),
                founderDTOs,
                company.getRate(),
                company.getUserId(),
                company.getCreatedByAdmin(),
                company.getCreatedDate(),
                company.getUpdateDate(),
                company.getLastModifiedBy()
        );
    }

    // DTO -> Entity
    public static Company toEntity(CompanyDTO dto) {
        Company company = new Company();
        company.setName(dto.getName());
        company.setLogo(dto.getLogo());
        company.setDescription(dto.getDescription());
        company.setEmail(dto.getEmail());
        company.setFoundedDate(dto.getFoundedDate());
        company.setRate(dto.getRate());
        company.setUserId(dto.getUserId());
        company.setCreatedByAdmin(dto.getCreatedByAdmin());
        company.setCreatedDate(dto.getCreatedDate());
        company.setUpdateDate(dto.getUpdateDate());
        company.setLastModifiedBy(dto.getLastModifiedBy());
        return company;
    }

}
