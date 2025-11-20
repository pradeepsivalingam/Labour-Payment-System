package com.labour.labour_payment.service;

import com.labour.labour_payment.model.Worker;
import com.labour.labour_payment.repository.WorkerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;

    public WorkerService(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    public List<Worker> getAllWorkers() {
        List<Worker> workers = workerRepository.findAll();
        workers.forEach(w -> {
            if (w.getRole() != null) {
                w.setRole(w.getRole().toUpperCase()); // Normalize role
            }
        });
        return workers;
    }

    public List<Worker> getWorkersByRole(String role) {
        List<Worker> workers = workerRepository.findByRoleIgnoreCase(role);
        workers.forEach(w -> {
            if (w.getRole() != null) {
                w.setRole(w.getRole().toUpperCase()); // Normalize role
            }
        });
        return workers;
    }

    public Worker saveWorker(Worker worker) {
        if (worker.getRole() != null) {
            worker.setRole(worker.getRole().toUpperCase()); // Ensure consistency
        }
        return workerRepository.save(worker);
    }

    public Worker updateWorker(Long id, Worker worker) {
        Worker existing = workerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        existing.setName(worker.getName());
        existing.setMobile(worker.getMobile());
        if (worker.getRole() != null) {
            existing.setRole(worker.getRole().toUpperCase());
        }
        existing.setAmount(worker.getAmount());
        existing.setSupervisor_id(worker.getSupervisor_id());
        return workerRepository.save(existing);
    }

    public void deleteWorker(Long id) {
        workerRepository.deleteById(id);
    }
}
