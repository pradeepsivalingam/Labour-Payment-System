package com.labour.labour_payment.model;

import jakarta.persistence.*;

@Entity
@Table(name = "advance_payment")
public class AdvancePayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // auto-increment for int
    private Integer id;

    @Column(name = "amount")
    private Integer amount;

    @Column(name = "name", length = 45)
    private String name;

    @Column(name = "role", length = 45)
    private String role;

    @Column(name = "year")
    private Integer year;

    @Column(name = "week_number")
    private Integer weekNumber;


    public AdvancePayment() {
    }

    // Getters and setters

    public Integer getId() {
        return id;
    }

    // No setter for id is needed but can be added if required
    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getWeekNumber() {
        return weekNumber;
    }

    public void setWeekNumber(Integer weekNumber) {
        this.weekNumber = weekNumber;
    }
}
