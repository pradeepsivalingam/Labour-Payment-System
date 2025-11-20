package com.labour.labour_payment.repository;

import com.labour.labour_payment.model.DailyWorkUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyWorkUpdateRepository extends JpaRepository<DailyWorkUpdate, Long> {
    List<DailyWorkUpdate> findByStartDateBetween(LocalDate startDate, LocalDate endDate);
    List<DailyWorkUpdate> findByStartDateBetweenAndRole(LocalDate startDate, LocalDate endDate, String role);
    List<DailyWorkUpdate> findAll();

    List<DailyWorkUpdate> findByStartDateBetweenAndRoleEquals(LocalDate startDate, LocalDate endDate, String role);
}
