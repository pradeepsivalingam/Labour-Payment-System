package com.labour.labour_payment.repository;

import com.labour.labour_payment.model.AdvancePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AdvancePaymentRepository extends JpaRepository<AdvancePayment, Integer>, JpaSpecificationExecutor<AdvancePayment> {
}
