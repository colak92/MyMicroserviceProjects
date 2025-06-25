package com.techjobs.repository;

import com.techjobs.model.NecessarySkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NecessarySkillRepository extends JpaRepository<NecessarySkill, Long> {

}
