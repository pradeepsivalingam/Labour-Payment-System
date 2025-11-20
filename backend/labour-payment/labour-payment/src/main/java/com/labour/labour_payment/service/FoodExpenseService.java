package com.labour.labour_payment.service;

import com.labour.labour_payment.model.FoodExpense;
import com.labour.labour_payment.repository.FoodExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FoodExpenseService {

    @Autowired
    private FoodExpenseRepository repository;

    public List<FoodExpense> getExpensesByWeekStartDate(LocalDate weekStartDate) {
        return repository.findByWeekStartDate(weekStartDate);
    }

    public List<FoodExpense> saveAllExpenses(List<FoodExpense> expenses) {
        // For each expense, check if exists (by week_start_date + name), update if yes or insert if no
        for (FoodExpense expense : expenses) {
            FoodExpense existing = repository.findByWeekStartDateAndName(expense.getWeekStartDate(), expense.getName());
            if (existing != null) {
                // Update existing record fields
                existing.setAmountSun(expense.getAmountSun());
                existing.setAmountMon(expense.getAmountMon());
                existing.setAmountTue(expense.getAmountTue());
                existing.setAmountWed(expense.getAmountWed());
                existing.setAmountThu(expense.getAmountThu());
                existing.setAmountFri(expense.getAmountFri());
                existing.setAmountSat(expense.getAmountSat());
                existing.setTotalAmount(expense.getTotalAmount());
                repository.save(existing);
            } else {
                // Insert new record
                repository.save(expense);
            }
        }
        // Return updated list for that week
        if (!expenses.isEmpty()) {
            return repository.findByWeekStartDate(expenses.get(0).getWeekStartDate());
        } else {
            return List.of();
        }
    }
}
