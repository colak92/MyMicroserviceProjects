package com.techjobs.repository;

import com.techjobs.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Company findByEmail(String email);
}
