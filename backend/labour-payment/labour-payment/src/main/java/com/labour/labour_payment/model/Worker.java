package com.labour.labour_payment.model;

import jakarta.persistence.*;

@Entity
@Table(name = "worker")
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String role;
    private String mobile;
    private Double amount;

    @Column(name = "supervisor_id")
    private Long supervisor_id;

    // Default constructor
    public Worker() {
    }

    // Constructor with all fields
    public Worker(Long id, String name, String role, String mobile, Double amount, Long supervisor_id) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.mobile = mobile;
        this.amount = amount;
        this.supervisor_id = supervisor_id;
    }

    // Getter methods
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public String getMobile() {
        return mobile;
    }

    public Double getAmount() {
        return amount;
    }

    public Long getSupervisor_id() {
        return supervisor_id;
    }

    // Setter methods
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setSupervisor_id(Long supervisor_id) {
        this.supervisor_id = supervisor_id;
    }
}
