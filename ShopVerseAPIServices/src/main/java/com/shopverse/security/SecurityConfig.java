package com.shopverse.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.shopverse.admin.security.AdminUserDetailsService;
import com.shopverse.security.filter.JwtAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private AdminUserDetailsService adminUserDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    UserDetailsService userDetailsService() {
        return adminUserDetailsService;
    }

    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authenticationProvider(authenticationProvider())

                .authorizeHttpRequests(auth -> auth

                	    .requestMatchers(
                	            "/api/admin/register",
                	            "/api/admin/login",
                	            "/user/register",
                	            "/user/login"
                	    ).permitAll()

                	    .requestMatchers("/api/admin/**")
                	    .hasRole("ADMIN")

                	    .requestMatchers("/user/**")
                	    .hasRole("USER")

                	    .anyRequest()
                	    .authenticated()
                	);

        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public org.springframework.security.authentication.dao.DaoAuthenticationProvider authenticationProvider() {

        org.springframework.security.authentication.dao.DaoAuthenticationProvider provider =
                new org.springframework.security.authentication.dao.DaoAuthenticationProvider();

        provider.setUserDetailsService(adminUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

}