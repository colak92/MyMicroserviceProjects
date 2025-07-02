package com.techjobs.dto;

import com.techjobs.model.CompanyStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDTO {
    private Long id;
    private String name;
    private CompanyStatus status;
    private String logo;
    private String description;
    private String email;
    private LocalDate foundedDate;
    private List<FounderDTO> founders = new ArrayList<>();
    private Double rate;
    private Long userId;
    private Boolean createdByAdmin;
    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
    private String lastModifiedBy;
}
