package edu.upc.upcschool.mortgage.security;

import org.springframework.security.core.Authentication;
import edu.upc.upcschool.mortgage.models.User;
import org.springframework.security.core.authority.AuthorityUtils;

import edu.upc.upcschool.mortgage.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class ApiKeyAuthExtractor {

    private final UserRepository userRepository;

    public ApiKeyAuthExtractor(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<Authentication> extract(HttpServletRequest request) {
        String providedKey = request.getHeader("ApiKey");
        Optional<User> user = userRepository.findByApiKey(providedKey);
        if (user.isEmpty()) {
            return Optional.empty();
        }
        ApiKeyAuth apiKeyAuth = new ApiKeyAuth(user.get(), AuthorityUtils.NO_AUTHORITIES);
        return Optional.of(apiKeyAuth);
    }
}
