package com.techjobs.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private CompanyStatus status;

    private String logo;

    @Lob
    @Column(name = "description", nullable = true)
    private String description;

    private String email;

    private LocalDateTime createdAt;

    private LocalDate foundedDate;

    @ElementCollection
    private List<String> founders = new ArrayList<>();

    @ElementCollection
    private List<String> jobs = new ArrayList<>();

    @Min(0)
    @Max(5)
    private Double rate;
}
