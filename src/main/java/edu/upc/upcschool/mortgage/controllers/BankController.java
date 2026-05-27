package edu.upc.upcschool.mortgage.controllers;

import edu.upc.upcschool.mortgage.models.Bank;
import edu.upc.upcschool.mortgage.repositories.BankRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping({ "/banks", "/banks/" })
public class BankController {
    // Bank Repository
    private final BankRepository bankRepository;

    // Initializing the Controller via Constructor, preventing null access before
    // creation at execution.
    public BankController(BankRepository bankRepository) {
        this.bankRepository = bankRepository;
    }

    @GetMapping()
    public ResponseEntity<Iterable<Bank>> findAll() {
        return ok(bankRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bank> findById(@PathVariable Integer id) {
        // Instancing the record if we found it.
        Optional<Bank> bankOptional = bankRepository.findById(id);
        if (bankOptional.isPresent()) {
            return ok(bankOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping()
    public ResponseEntity<Bank> create(@RequestBody Bank newBank, UriComponentsBuilder ucb) {
        Bank savedBank = bankRepository.save(newBank);
        // Creation of uri to allocate the correct 201 response into header response.
        URI location = ucb.path("/banks/{id}").buildAndExpand(savedBank.id()).toUri();
        return ResponseEntity.created(location).body(savedBank);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bank> update(@PathVariable Integer id, @RequestBody Bank bank) {
        if (bankRepository.existsById(id)) {
            Bank bankToSave = new Bank(id, bank.name(), bank.bank_code(), bank.url());
            Bank updatedBank = bankRepository.save(bankToSave);
            return ResponseEntity.ok(updatedBank);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
