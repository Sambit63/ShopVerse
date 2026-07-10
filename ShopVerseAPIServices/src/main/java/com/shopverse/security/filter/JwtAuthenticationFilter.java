package com.shopverse.security.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.shopverse.admin.security.AdminUserDetailsService;
import com.shopverse.repository.UserRegistrationRepository;
import com.shopverse.security.jwt.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.shopverse.entity.UserRegistration;
import com.shopverse.repository.UserRegistrationRepository;
import com.shopverse.security.CustomUserDetails;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AdminUserDetailsService adminUserDetailsService;
    
    @Autowired
    private UserRegistrationRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);

        String email = jwtService.extractUsername(jwt);

        if (email != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

        	UserDetails userDetails = null;

        	// Check Admin
        	try {
        	    userDetails = adminUserDetailsService.loadUserByUsername(email);
        	} catch (UsernameNotFoundException ex) {

        	    // Check User
        	    UserRegistration user = userRepository.findByEmail(email).orElse(null);

        	    if (user != null) {
        	        userDetails = new CustomUserDetails(user);
        	    }
        	}

        	if (userDetails != null &&
        	        jwtService.isTokenValid(jwt, userDetails.getUsername())) {

        	    UsernamePasswordAuthenticationToken authToken =
        	            new UsernamePasswordAuthenticationToken(
        	                    userDetails,
        	                    null,
        	                    userDetails.getAuthorities());

        	    authToken.setDetails(
        	            new WebAuthenticationDetailsSource()
        	                    .buildDetails(request));

        	    SecurityContextHolder.getContext()
        	            .setAuthentication(authToken);
        	}
        }

        filterChain.doFilter(request, response);
    }
}