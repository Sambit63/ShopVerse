package com.shopverse.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopverse.dto.UserLoginRequest;
import com.shopverse.dto.UserLoginResponse;
import com.shopverse.dto.UserRegistrationRequest;
import com.shopverse.entity.UserRegistration;
import com.shopverse.service.UserRegistrationService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserRegistrationController {

    private final UserRegistrationService service;

    @PostMapping("/register")
    public UserRegistration registerUser(@RequestBody UserRegistrationRequest request) {
    	System.out.println("The request data is :"+request.toString());
        return service.registerUser(request);

    }
    @PostMapping("/login")
    public UserLoginResponse login(
            @RequestBody UserLoginRequest request){
    	System.out.println("User login controller called");
        return service.login(request);

    }
    @GetMapping("/profile")
    public String  getProfile()
    {
    	return "Profile Details Fetched";
    }

}