package edu.upc.upcschool.mortgage.repositories;

import edu.upc.upcschool.mortgage.models.MortgageFavorite;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MortgageFavoriteRepository extends CrudRepository<MortgageFavorite, Integer> {

    /** Check whether a specific user has already favourited a specific mortgage. */
    Optional<MortgageFavorite> findByUserIdAndMortgageId(Integer userId, Integer mortgageId);

    /** Count how many users have favourited a given mortgage. */
    long countByMortgageId(Integer mortgageId);

    /** Remove a specific user's favourite for a specific mortgage. */
    @Modifying
    @Query("DELETE FROM mortgage_favorite WHERE user_id = :userId AND mortgage_id = :mortgageId")
    void deleteByUserIdAndMortgageId(Integer userId, Integer mortgageId);
}
