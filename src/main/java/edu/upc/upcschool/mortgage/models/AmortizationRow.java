package edu.upc.upcschool.mortgage.models;

import java.math.BigDecimal;

public record AmortizationRow(
    int month,
    BigDecimal interestPayment,
    BigDecimal principalPayment,
    BigDecimal pendingCapital
) {}
