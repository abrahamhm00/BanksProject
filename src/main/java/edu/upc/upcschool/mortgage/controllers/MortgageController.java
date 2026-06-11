package edu.upc.upcschool.mortgage.controllers;

import edu.upc.upcschool.mortgage.models.Mortgage;
import edu.upc.upcschool.mortgage.repositories.BankRepository;
import edu.upc.upcschool.mortgage.repositories.MortgageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping({ "/banks/{bankId}/mortgages" })
public class MortgageController {

    private final MortgageRepository mortageRepository;
    private final BankRepository bankRepository;

    /**
     * Initializing Mortgage Controller via class Constructor, preventing null
     * access
     * before creation at execution.
     */
    public MortgageController(MortgageRepository mortgageRepository,
            BankRepository bankRepository) {
        this.mortageRepository = mortgageRepository;
        this.bankRepository = bankRepository;
    }

    @GetMapping
    public ResponseEntity<List<Mortgage>> findAll(@PathVariable Integer bankId) {
        if (!bankRepository.existsById(bankId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mortageRepository.findByBankId(bankId));
    }

}
