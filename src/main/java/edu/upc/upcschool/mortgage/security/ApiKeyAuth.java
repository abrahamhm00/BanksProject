package edu.upc.upcschool.mortgage.security;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;

import org.springframework.security.core.GrantedAuthority;

import edu.upc.upcschool.mortgage.models.User;

public class ApiKeyAuth extends AbstractAuthenticationToken {

    private final User user;

    public ApiKeyAuth(User user, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.user = user;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return user;
    }
}
