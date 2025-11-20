package com.labour.labour_payment.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "daily_work_updates")
@Getter
@Setter
public class DailyWorkUpdate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", referencedColumnName = "id")
    private Worker worker;

    @Transient
    private String name;
    
    @Column(name = "role")
    private String role;

    private Float sunday = 0f;
    private Float monday = 0f;
    private Float tuesday = 0f;
    private Float wednesday = 0f;
    private Float thursday = 0f;
    private Float friday = 0f;
    private Float saturday = 0f;

    @Column(name = "total_shifts")
    private Float totalShifts = 0f;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}
