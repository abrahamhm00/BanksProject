package edu.upc.upcschool.mortgage.models;

import java.math.BigDecimal;

/**
 * Read-only projection returned by the ranking endpoint.
 * Combines mortgage fields with its aggregated favourite count.
 */
public record MortgageRankingEntry(
        Integer id,
        Integer bankId,
        String name,
        String type,
        String description,
        BigDecimal TAE,
        long favoriteCount) {
}
