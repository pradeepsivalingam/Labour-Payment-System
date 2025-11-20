package com.labour.labour_payment.controller;

import com.labour.labour_payment.dto.AdvancePaymentPayload;
import com.labour.labour_payment.model.AdvancePayment;
import com.labour.labour_payment.service.AdvancePaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class AdvancePaymentController {

    private final AdvancePaymentService service;

    public AdvancePaymentController(AdvancePaymentService service) {
        this.service = service;
    }

    @GetMapping("/advance-payments")
    public ResponseEntity<List<AdvancePayment>> getAllPayments(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer week,
            @RequestParam(required = false) String role
    ) {
        if (year != null || week != null || role != null) {
            return ResponseEntity.ok(service.getPaymentsByFilter(year, week, role));
        }
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping("/advance-payments")
    public ResponseEntity<String> savePayments(@RequestBody AdvancePaymentPayload payload) {
        service.saveAll(payload.getSave());
        service.deleteAll(payload.getDelete());
        return ResponseEntity.ok("Advance payments saved successfully");
    }
}
