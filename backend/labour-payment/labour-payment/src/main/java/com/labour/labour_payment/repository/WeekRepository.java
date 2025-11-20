package com.labour.labour_payment.repository;

import com.labour.labour_payment.model.Week;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WeekRepository extends JpaRepository<Week, Long> {
    List<Week> findByYear(int year);
    List<Week> findAll();
    boolean existsByYear(int year);
}
