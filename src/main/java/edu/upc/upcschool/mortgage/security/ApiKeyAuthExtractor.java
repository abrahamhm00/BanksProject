package edu.upc.upcschool.mortgage.security;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.AuthorityUtils;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Optional;

public class ApiKeyAuthExtractor {

    @Value("${application.security.api-key}")
    private String apiKey;

    public Optional<Authentication> extract(HttpServletRequest request) {
        String providedKey = request.getHeader("ApiKey");
        if (providedKey == null || !providedKey.equals(apiKey)) {
            return Optional.empty();
        }
        return Optional.of(new ApiKeyAuth(providedKey, AuthorityUtils.NO_AUTHORITIES));
    }
}
