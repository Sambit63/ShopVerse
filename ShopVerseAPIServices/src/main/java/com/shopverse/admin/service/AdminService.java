package com.shopverse.admin.service;

import com.shopverse.admin.dto.AdminLoginRequest;
import com.shopverse.admin.dto.AdminLoginResponse;
import com.shopverse.admin.dto.AdminRegistrationRequest;

public interface AdminService {

    String register(AdminRegistrationRequest request);

    AdminLoginResponse login(AdminLoginRequest request);
}