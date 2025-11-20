package com.labour.labour_payment.service;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Table(name = "weeks", uniqueConstraints = @UniqueConstraint(columnNames = {"year", "weekNumber"}))
@Getter
@Setter
public class Week {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int year;
    private int weekNumber;
    private LocalDate startDate;
    private LocalDate endDate;
}
