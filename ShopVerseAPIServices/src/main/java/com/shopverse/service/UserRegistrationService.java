package com.shopverse.service;

import com.shopverse.dto.UserLoginRequest;
import com.shopverse.dto.UserLoginResponse;
import com.shopverse.dto.UserRegistrationRequest;
import com.shopverse.entity.UserRegistration;

public interface UserRegistrationService {

    UserRegistration registerUser(UserRegistrationRequest request);
    
    UserLoginResponse login(UserLoginRequest request);

}