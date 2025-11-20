package com.labour.labour_payment.controller;

import com.labour.labour_payment.model.Week;
import com.labour.labour_payment.repository.WeekRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/weeks")
public class WeekController {

    @Autowired
    private WeekRepository weekRepository;

    @GetMapping
    public List<Week> getAllWeeks() {
        return weekRepository.findAll();
    }

    @GetMapping("/year/{year}")
    public List<Week> getWeeksByYear(@PathVariable int year) {
        return weekRepository.findByYear(year);
    }

    @PostMapping
    public Week addWeek(@RequestBody Week week) {
        return weekRepository.save(week);
    }
}
