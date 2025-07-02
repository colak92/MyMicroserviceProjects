package com.techjobs.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

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

    private LocalDate foundedDate;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    @ToString.Exclude
    @JsonManagedReference
    private List<Founder> founders = new ArrayList<>();

    @Min(0)
    @Max(5)
    private Double rate;

    private Long userId;

    private Boolean createdByAdmin = false;

    private LocalDateTime createdDate;

    private LocalDateTime updateDate;

    private String lastModifiedBy;

    @PrePersist
    public void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.updateDate = this.createdDate;
    }

    @PreUpdate
    public void onUpdate() {
        this.updateDate = LocalDateTime.now();
    }
}
