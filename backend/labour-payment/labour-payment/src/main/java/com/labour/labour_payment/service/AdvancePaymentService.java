package com.labour.labour_payment.service;

import com.labour.labour_payment.model.AdvancePayment;
import com.labour.labour_payment.repository.AdvancePaymentRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdvancePaymentService {
    private final AdvancePaymentRepository repository;

    public AdvancePaymentService(AdvancePaymentRepository repository) {
        this.repository = repository;
    }

    public List<AdvancePayment> getAll() {
        return repository.findAll();
    }

    public List<AdvancePayment> getPaymentsByFilter(Integer year, Integer week, String role) {
        Specification<AdvancePayment> spec = Specification.where(null);

        if (year != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("year"), year));
        }

        if (week != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("weekNumber"), week));
        }

        if (role != null && !role.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("role"), role));
        }

        return repository.findAll(spec);
    }

    public void saveAll(List<AdvancePayment> payments) {
        repository.saveAll(payments);
    }

    public void deleteAll(List<Integer> ids) {
        repository.deleteAllById(ids);
    }
}
