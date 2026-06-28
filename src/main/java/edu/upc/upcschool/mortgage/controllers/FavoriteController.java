package edu.upc.upcschool.mortgage.controllers;

import edu.upc.upcschool.mortgage.models.Mortgage;
import edu.upc.upcschool.mortgage.models.MortgageFavorite;
import edu.upc.upcschool.mortgage.models.MortgageRankingEntry;
import edu.upc.upcschool.mortgage.models.User;
import edu.upc.upcschool.mortgage.repositories.MortgageFavoriteRepository;
import edu.upc.upcschool.mortgage.repositories.MortgageRepository;
import edu.upc.upcschool.mortgage.security.ApiKeyAuth;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Handles mortgage favouriting and the public ranking endpoint.
 *
 * <p>Endpoints:
 * <ul>
 *   <li>POST /banks/{bankId}/mortgages/{id}/favorite — toggle favourite for the authenticated user</li>
 *   <li>GET  /mortgages/ranking                      — public ranking sorted by favourite count desc</li>
 * </ul>
 */
@RestController
public class FavoriteController {

    private final MortgageFavoriteRepository favoriteRepository;
    private final MortgageRepository mortgageRepository;

    public FavoriteController(MortgageFavoriteRepository favoriteRepository,
                              MortgageRepository mortgageRepository) {
        this.favoriteRepository = favoriteRepository;
        this.mortgageRepository = mortgageRepository;
    }

    // ─────────────────────────────────────────────────────────────────
    // POST /banks/{bankId}/mortgages/{id}/favorite
    // Toggle: adds the favourite if absent, removes it if already present.
    // ─────────────────────────────────────────────────────────────────
    @PostMapping("/banks/{bankId}/mortgages/{id}/favorite")
    public ResponseEntity<Map<String, Object>> toggleFavorite(
            @PathVariable Integer bankId,
            @PathVariable Integer id) {

        // 1. Identify the caller
        ApiKeyAuth auth = (ApiKeyAuth) SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        // 2. Verify the mortgage exists within the given bank
        if (!mortgageRepository.existsByIdAndBankId(id, bankId)) {
            return ResponseEntity.notFound().build();
        }

        // 3. Toggle: remove if already favourited, add otherwise
        Optional<MortgageFavorite> existing = favoriteRepository.findByUserIdAndMortgageId(user.id(), id);

        boolean nowFavorited;
        if (existing.isPresent()) {
            favoriteRepository.deleteByUserIdAndMortgageId(user.id(), id);
            nowFavorited = false;
        } else {
            favoriteRepository.save(new MortgageFavorite(null, user.id(), id));
            nowFavorited = true;
        }

        // 4. Return updated state and current count
        long count = favoriteRepository.countByMortgageId(id);
        return ResponseEntity.ok(Map.of(
                "mortgageId", id,
                "favorited", nowFavorited,
                "totalFavorites", count
        ));
    }

    // ─────────────────────────────────────────────────────────────────
    // GET /mortgages/ranking
    // Public — returns all mortgages sorted by favourite count descending.
    // ─────────────────────────────────────────────────────────────────
    @GetMapping("/mortgages/ranking")
    public ResponseEntity<List<MortgageRankingEntry>> getRanking() {

        // Fetch all mortgages, enrich each one with its favourite count, sort
        Iterable<Mortgage> allMortgages = mortgageRepository.findAll();

        List<MortgageRankingEntry> ranking = ((List<Mortgage>) allMortgages).stream()
                .map(m -> new MortgageRankingEntry(
                        m.id(),
                        m.bankId(),
                        m.name(),
                        m.type(),
                        m.description(),
                        m.TAE(),
                        favoriteRepository.countByMortgageId(m.id())
                ))
                .sorted(Comparator.comparingLong(MortgageRankingEntry::favoriteCount).reversed())
                .toList();

        return ResponseEntity.ok(ranking);
    }
}
