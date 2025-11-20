package com.labour.labour_payment.controller;

import com.labour.labour_payment.model.FoodExpense;
import com.labour.labour_payment.service.FoodExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/food-expenses")
@CrossOrigin(origins = "*")  // Adjust this for your frontend origin
public class FoodExpenseController {

    @Autowired
    private FoodExpenseService service;

    // Fetch expenses by week start date: GET /api/food-expenses?weekStartDate=YYYY-MM-DD
    @GetMapping
    public ResponseEntity<List<FoodExpense>> getByWeekStartDate(
            @RequestParam("weekStartDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStartDate) {
        List<FoodExpense> expenses = service.getExpensesByWeekStartDate(weekStartDate);
        return ResponseEntity.ok(expenses);
    }

    // Save (insert or update) all expenses in a batch
    @PostMapping
    public ResponseEntity<List<FoodExpense>> saveAllExpenses(@RequestBody List<FoodExpense> expenses) {
        List<FoodExpense> saved = service.saveAllExpenses(expenses);
        return ResponseEntity.ok(saved);
    }
}
