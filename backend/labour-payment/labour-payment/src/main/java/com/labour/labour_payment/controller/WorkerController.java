package com.labour.labour_payment.controller;

import com.labour.labour_payment.model.Worker;
import com.labour.labour_payment.service.WorkerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "http://localhost:3000")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @GetMapping
    public ResponseEntity<List<Worker>> getAllWorkers(
            @RequestParam(required = false) String role
    ) {
        List<Worker> workers;
        if (role != null && !role.isEmpty()) {
            workers = workerService.getWorkersByRole(role);
        } else {
            workers = workerService.getAllWorkers();
        }
        return ResponseEntity.ok(workers);
    }

    @PostMapping
    public ResponseEntity<Worker> createWorker(@RequestBody Worker worker) {
        return ResponseEntity.ok(workerService.saveWorker(worker));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Worker> updateWorker(@PathVariable Long id, @RequestBody Worker worker) {
        return ResponseEntity.ok(workerService.updateWorker(id, worker));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id);
        return ResponseEntity.ok().build();
    }
}
