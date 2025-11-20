package com.labour.labour_payment.dto;

import com.labour.labour_payment.model.AdvancePayment;

import java.util.List;

public class AdvancePaymentPayload {
    private List<AdvancePayment> save;
    private List<Integer> delete;

    public List<AdvancePayment> getSave() {
        return save;
    }

    public void setSave(List<AdvancePayment> save) {
        this.save = save;
    }

    public List<Integer> getDelete() {
        return delete;
    }

    public void setDelete(List<Integer> delete) {
        this.delete = delete;
    }
}
