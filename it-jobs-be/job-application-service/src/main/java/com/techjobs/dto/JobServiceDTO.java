package com.techjobs.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobServiceDTO {
    private Long id;
    private String name;
    private Long companyId;
}