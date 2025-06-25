package com.techjobs.repository;

import com.techjobs.model.AdditionalSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdditionalSkillRepository extends JpaRepository<AdditionalSkill, Long> {
}
