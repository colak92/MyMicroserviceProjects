package com.techjobs.repository;

import com.techjobs.model.Founder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FounderRepository extends JpaRepository<Founder, Long> {

    List<Founder> findByCompanyId(Long companyId);

    List<Founder> findByCompanyIsNull();

}
