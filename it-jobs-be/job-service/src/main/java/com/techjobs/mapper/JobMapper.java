package com.techjobs.mapper;

import com.techjobs.dto.AdditionalSkillDTO;
import com.techjobs.dto.JobDTO;
import com.techjobs.dto.NecessarySkillDTO;
import com.techjobs.model.AdditionalSkill;
import com.techjobs.model.Job;
import com.techjobs.model.NecessarySkill;

public class JobMapper {

    // Entity -> DTO
    public static JobDTO toDTO(Job job) {
        return new JobDTO(
                job.getId(),
                job.getName(),
                job.getStatus(),
                job.getSeniority(),
                job.getDescription(),
                job.getDeadline(),
                job.getCreatedAt(),
                job.getNecessarySkills().stream()
                        .map(necessarySkill -> new NecessarySkillDTO(necessarySkill.getId(), necessarySkill.getName()))
                        .toList(),
                job.getAdditionalSkills().stream()
                        .map(additionalSkill -> new AdditionalSkillDTO(additionalSkill.getId(), additionalSkill.getName()))
                        .toList(),
                job.getCompanyId()
        );
    }

    // DTO -> Entity
    public static Job toEntity(JobDTO dto) {
        Job job = new Job();
        job.setId(dto.getId());
        job.setName(dto.getName());
        job.setStatus(dto.getStatus());
        job.setSeniority(dto.getSeniority());
        job.setDescription(dto.getDescription());
        job.setDeadline(dto.getDeadline());
        job.setCreatedAt(dto.getCreatedAt());
        job.setCompanyId(dto.getCompanyId());

        if (dto.getNecessarySkills() != null) {
            job.setNecessarySkills(
                    dto.getNecessarySkills().stream()
                            .map(nsDto -> {
                                NecessarySkill ns = new NecessarySkill();
                                ns.setId(nsDto.getId());
                                ns.setName(nsDto.getName());
                                return ns;
                            })
                            .toList()
            );
        }

        if (dto.getAdditionalSkills() != null) {
            job.setAdditionalSkills(
                    dto.getAdditionalSkills().stream()
                            .map(asDto -> {
                                AdditionalSkill as = new AdditionalSkill();
                                as.setId(asDto.getId());
                                as.setName(asDto.getName());
                                return as;
                            })
                            .toList()
            );
        }

        return job;
    }
}