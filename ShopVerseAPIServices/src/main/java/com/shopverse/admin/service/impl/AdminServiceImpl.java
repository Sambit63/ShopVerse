package com.shopverse.admin.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.shopverse.admin.dto.AdminLoginRequest;
import com.shopverse.admin.dto.AdminLoginResponse;
import com.shopverse.admin.dto.AdminRegistrationRequest;
import com.shopverse.admin.entity.Admin;
import com.shopverse.admin.repository.AdminRepository;
import com.shopverse.admin.service.AdminService;
import com.shopverse.security.jwt.JwtService;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtService jwtService;

    @Override
    public String register(AdminRegistrationRequest request) {

        if (repository.existsByEmail(request.getEmail())) {
            return "Admin already exists";
        }

        Admin admin = new Admin();

        admin.setAdminName(request.getAdminName());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole("ROLE_ADMIN");

        repository.save(admin);

        return "Admin Registered Successfully";
    }

    @Override
    public AdminLoginResponse login(AdminLoginRequest request) {

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword())

        );

        String token = jwtService.generateToken(request.getEmail());

        return new AdminLoginResponse(token);
    }

}