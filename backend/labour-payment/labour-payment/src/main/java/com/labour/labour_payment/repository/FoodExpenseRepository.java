package com.labour.labour_payment.repository;

import com.labour.labour_payment.model.FoodExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodExpenseRepository extends JpaRepository<FoodExpense, Long> {

    List<FoodExpense> findByWeekStartDate(LocalDate weekStartDate);

    // Optional: To check if an entry exists for a week and name
    boolean existsByWeekStartDateAndName(LocalDate weekStartDate, String name);

    FoodExpense findByWeekStartDateAndName(LocalDate weekStartDate, String name);
}
