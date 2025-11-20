package com.labour.labour_payment.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LogoutRequest {
    private String userId;

    public LogoutRequest(String userId) {
        this.userId = userId;
    }

}
