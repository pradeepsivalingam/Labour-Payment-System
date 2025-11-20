package com.labour.labour_payment.model;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "food_expenses",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"week_start_date", "name"})})
public class FoodExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "week_start_date", nullable = false)
    private LocalDate weekStartDate;

    @Column(nullable = false)
    private String name;

    @Column(name = "amount_sun", columnDefinition = "DECIMAL(10, 2) DEFAULT 0")
    private Double amountSun = 0.0;

    @Column(name = "amount_mon", columnDefinition = "DECIMAL(10, 2) DEFAULT 0")
    private Double amountMon = 0.0;

    @Column(name = "amount_tue", columnDefinition = "DECIMAL(10, 2) DEFAULT 0")
    private Double amountTue = 0.0;

    @Column(name = "amount_wed", columnDefinition = "DECIMAL(10, 2) DEFAULT 0")
    private Double amountWed = 0.0;

    @Column(name = "amount_thu", columnDefinition = "DECIMAL(10, 2) DEFAULT 0")
    private Double amountThu = 0.0;

    @Column(name = "amount_fri", columnDefinition = "DECIMAL(10, 2) DEFAULT 0")
    private Double amountFri = 0.0;

    @Column(name = "amount_sat", columnDefinition = "DECIMAL(10, 2) DEFAULT 0")
    private Double amountSat = 0.0;

    @Column(name = "total_amount", columnDefinition = "DECIMAL(10, 2) DEFAULT 0")
    private Double totalAmount = 0.0;

    // Constructors
    public FoodExpense() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getWeekStartDate() { return weekStartDate; }
    public void setWeekStartDate(LocalDate weekStartDate) { this.weekStartDate = weekStartDate; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getAmountSun() { return amountSun; }
    public void setAmountSun(Double amountSun) { this.amountSun = amountSun; }

    public Double getAmountMon() { return amountMon; }
    public void setAmountMon(Double amountMon) { this.amountMon = amountMon; }

    public Double getAmountTue() { return amountTue; }
    public void setAmountTue(Double amountTue) { this.amountTue = amountTue; }

    public Double getAmountWed() { return amountWed; }
    public void setAmountWed(Double amountWed) { this.amountWed = amountWed; }

    public Double getAmountThu() { return amountThu; }
    public void setAmountThu(Double amountThu) { this.amountThu = amountThu; }

    public Double getAmountFri() { return amountFri; }
    public void setAmountFri(Double amountFri) { this.amountFri = amountFri; }

    public Double getAmountSat() { return amountSat; }
    public void setAmountSat(Double amountSat) { this.amountSat = amountSat; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
}
