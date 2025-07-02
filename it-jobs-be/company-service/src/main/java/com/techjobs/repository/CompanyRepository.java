package com.techjobs.repository;

import com.techjobs.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByUserId(Long userId);

    Company findByEmail(String email);

    Optional<Company> findByEmailAndUserIdIsNull(String email);
}
