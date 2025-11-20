package com.labour.labour_payment.repository;

import com.labour.labour_payment.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkerRepository extends JpaRepository<Worker, Long> {
    List<Worker> findByRoleIgnoreCase(String role);
}
