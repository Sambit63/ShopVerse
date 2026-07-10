package com.shopverse.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.shopverse.admin.dto.AdminLoginRequest;
import com.shopverse.admin.dto.AdminLoginResponse;
import com.shopverse.admin.dto.AdminRegistrationRequest;
import com.shopverse.admin.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService service;

    @PostMapping("/register")
    public String register(@RequestBody AdminRegistrationRequest request) {

        return service.register(request);
    }

    @PostMapping("/login")
    public AdminLoginResponse login(@RequestBody AdminLoginRequest request) {
    	System.out.println("===== LOGIN API CALLED ====="+request);
        return service.login(request);
    }
    @GetMapping("/dashboard")
    public String dashboard() {

        return "Welcome Admin Dashboard";

    }
}