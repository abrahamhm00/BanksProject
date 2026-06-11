package edu.upc.upcschool.mortgage.repositories;

import edu.upc.upcschool.mortgage.models.Mortgage;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MortgageRepository extends CrudRepository<Mortgage, Integer> {
    List<Mortgage> findByBankId(Integer bankId);

    Optional<Mortgage> findByIdAndBankId(Integer id, Integer bankId);

    boolean existsByIdAndBankId(Integer id, Integer bankId);

    void deleteByIdAndBankId(Integer id, Integer bankId);
}
