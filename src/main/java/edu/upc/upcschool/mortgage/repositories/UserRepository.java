package edu.upc.upcschool.mortgage.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import edu.upc.upcschool.mortgage.models.User;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByApiKey(String apiKey);
}
