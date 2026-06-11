package edu.upc.upcschool.mortgage.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import java.math.BigDecimal;

public record Mortgage(
        @Id Integer id,
        @Column("BANK_ID") Integer bankId,
        String name,
        String type,
        String description,
        BigDecimal TAE) {
}
