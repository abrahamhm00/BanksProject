package edu.upc.upcschool.mortgage.controllers;

import edu.upc.upcschool.mortgage.models.Mortgage;
import edu.upc.upcschool.mortgage.repositories.BankRepository;
import edu.upc.upcschool.mortgage.repositories.MortgageRepository;
import edu.upc.upcschool.mortgage.services.MortgageSimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping({ "/banks/{bankId}/mortgages" })
public class MortgageController {

    private final MortgageRepository mortgageRepository;
    private final BankRepository bankRepository;

    /**
     * Initializing Mortgage Controller via class Constructor, preventing null
     * access
     * before creation at execution.
     */
    public MortgageController(MortgageRepository mortgageRepository,
            BankRepository bankRepository,
            MortgageSimulationService mortgageSimulationService) {
        this.mortgageRepository = mortgageRepository;
        this.bankRepository = bankRepository;
        this.mortgageSimulationService = mortgageSimulationService;
    }

    @GetMapping
    public ResponseEntity<List<Mortgage>> findAll(@PathVariable Integer bankId) {
        if (!bankRepository.existsById(bankId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mortgageRepository.findByBankId(bankId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mortgage> findById(@PathVariable Integer bankId,
            @PathVariable Integer id) {
        if (!bankRepository.existsById(bankId)) {
            return ResponseEntity.notFound().build();
        }
        return mortgageRepository.findByIdAndBankId(id, bankId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Mortgage> create(@PathVariable Integer bankId,
            @RequestBody Mortgage newMortgage,
            UriComponentsBuilder ucb) {

        if (!bankRepository.existsById(bankId)) {
            return ResponseEntity.notFound().build();
        }
        Mortgage toSave = new Mortgage(null, bankId, newMortgage.name(), newMortgage.type(), newMortgage.description(),
                newMortgage.TAE());
        Mortgage saved = mortgageRepository.save(toSave);

        URI location = ucb
                .path("/banks/{bankId}/mortgages")
                .buildAndExpand(bankId)
                .toUri();
        return ResponseEntity.created(location).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mortgage> update(@PathVariable Integer bankId,
            @PathVariable Integer id,
            @RequestBody Mortgage updateMortgage) {
        if (!mortgageRepository.existsByIdAndBankId(id, bankId)) {
            return ResponseEntity.notFound().build();
        }
        Mortgage toSave = new Mortgage(id, bankId, updateMortgage.name(), updateMortgage.type(),
                updateMortgage.description(), updateMortgage.TAE());
        return ResponseEntity.ok(mortgageRepository.save(toSave));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Mortgage> delete(@PathVariable Integer bankId,
            @PathVariable Integer id) {
        if (!mortgageRepository.existsByIdAndBankId(id, bankId)) {
            return ResponseEntity.notFound().build();
        }
        mortgageRepository.deleteByIdAndBankId(id, bankId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/simulate")
    public ResponseEntity<Mortgage> simulate(@PathVariable Integer bankId,
             @PathVariable Integer id,
             @RequestParam double principal,
             @RequestParam int years){
        
        if(!mortgageRepository.existsByIdAndBankId(id, bankId)){
            return ResponseEntity.notFound().build();
        }
        double cuota = mortgageSimulationService.
    }
}
