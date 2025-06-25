package com.techjobs.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "founder")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Founder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = true)
    @ToString.Exclude
    @JsonBackReference
    private Company company;
}