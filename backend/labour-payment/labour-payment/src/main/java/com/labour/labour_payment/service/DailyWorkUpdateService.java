package com.labour.labour_payment.service;

import com.labour.labour_payment.model.DailyWorkUpdate;
import com.labour.labour_payment.repository.DailyWorkUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DailyWorkUpdateService {
    @Autowired
    private DailyWorkUpdateRepository repo;

    public List<DailyWorkUpdate> getWorkUpdatesByDateRange(LocalDate startDate, LocalDate endDate) {
        return repo.findByStartDateBetween(startDate, endDate);
    }

    public List<DailyWorkUpdate> getWorkUpdatesByDateRangeAndRole(LocalDate startDate, LocalDate endDate, String role) {
        // Requires @Query("SELECT d FROM DailyWorkUpdate d WHERE d.startDate BETWEEN ?1 AND ?2 AND d.role = ?3")
        // public List<DailyWorkUpdate> findByStartDateBetweenAndRole(...); in repository
        return repo.findByStartDateBetweenAndRoleEquals(startDate, endDate, role);
    }

    public List<DailyWorkUpdate> getAll() {
        return repo.findAll();
    }

    public Optional<DailyWorkUpdate> getDailyWorkUpdateById(Long id) {
        return repo.findById(id);
    }

    public void deleteDailyWorkUpdate(Long id) {
        repo.deleteById(id);
    }

    public List<DailyWorkUpdate> saveAll(List<DailyWorkUpdate> updates) {
        return repo.saveAll(updates);
    }
}
