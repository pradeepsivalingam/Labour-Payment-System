package com.labour.labour_payment.controller;

import com.labour.labour_payment.model.DailyWorkUpdate;
import com.labour.labour_payment.service.DailyWorkUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/daily-work-updates")
public class DailyWorkUpdateController {
    @Autowired
    private DailyWorkUpdateService service;

    @GetMapping
    public List<DailyWorkUpdate> getWorkUpdates(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String role
    ) {
        if (startDate != null && endDate != null && role != null)
            return service.getWorkUpdatesByDateRangeAndRole(
                    LocalDate.parse(startDate), LocalDate.parse(endDate), role
            );
        if (startDate != null && endDate != null)
            return service.getWorkUpdatesByDateRange(
                    LocalDate.parse(startDate), LocalDate.parse(endDate)
            );
        return service.getAll();
    }

    @PostMapping
    public List<DailyWorkUpdate> saveAll(@RequestBody List<DailyWorkUpdate> updates) {
        return service.saveAll(updates);
    }

    @DeleteMapping("/{id}")
    public void deleteUpdate(@PathVariable Long id) {
        service.deleteDailyWorkUpdate(id);
    }
}
