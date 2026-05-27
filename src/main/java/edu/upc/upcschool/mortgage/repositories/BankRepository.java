package edu.upc.upcschool.mortgage.repositories;

import edu.upc.upcschool.mortgage.models.Bank;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BankRepository extends CrudRepository<Bank, Integer> {
}