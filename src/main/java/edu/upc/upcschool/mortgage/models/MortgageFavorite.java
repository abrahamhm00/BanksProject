package edu.upc.upcschool.mortgage.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * Join entity that records which user has marked which mortgage as a favourite.
 * The UNIQUE constraint (user_id, mortgage_id) is enforced at the DB level,
 * so each user can only favourite a given mortgage once.
 */
@Table("MORTGAGE_FAVORITE")
public record MortgageFavorite(
        @Id Integer id,
        @Column("USER_ID") Integer userId,
        @Column("MORTGAGE_ID") Integer mortgageId) {
}
