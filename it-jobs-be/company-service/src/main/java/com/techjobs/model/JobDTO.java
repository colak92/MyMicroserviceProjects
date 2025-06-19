package com.techjobs.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobDTO {

    private Long id;

    private String name;

    private String description;

    private LocalDateTime deadline;

    private LocalDateTime createdAt;

    private Long companyId;
}
