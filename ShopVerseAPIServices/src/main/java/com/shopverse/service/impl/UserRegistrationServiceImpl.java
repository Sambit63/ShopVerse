package com.shopverse.service.impl;

import java.time.LocalDateTime;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.shopverse.dto.CustomResponse;
import com.shopverse.dto.UserLoginRequest;
import com.shopverse.dto.UserLoginResponse;
import com.shopverse.dto.UserRegistrationRequest;
import com.shopverse.entity.UserRegistration;
import com.shopverse.repository.UserRegistrationRepository;
import com.shopverse.security.jwt.JwtService;
import com.shopverse.service.UserRegistrationService;

@Service
public class UserRegistrationServiceImpl implements UserRegistrationService {

    private final UserRegistrationRepository repository;

    private final BCryptPasswordEncoder passwordEncoder;

    public UserRegistrationServiceImpl(UserRegistrationRepository repository,
                                       BCryptPasswordEncoder passwordEncoder) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    private JwtService jwtService;

    @Override
    public CustomResponse<UserRegistration> registerUser(UserRegistrationRequest request) {

        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered.");
        }

        UserRegistration user = new UserRegistration();

        BeanUtils.copyProperties(request, user);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole("ROLE_USER");

        user.setActive(true);

        user.setCreatedDate(LocalDateTime.now());

        user.setUpdatedDate(LocalDateTime.now());
        UserRegistration save = repository.save(null);
        if(save!=null)
        {
        	return CustomResponse.success("User Registered Sucessfully", null);
        }
        else
        	return CustomResponse.error("Failed to register user");
    }
    @Override
    public UserLoginResponse login(UserLoginRequest request) {

        UserRegistration user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (Boolean.FALSE.equals(user.getActive())) {
            throw new RuntimeException("User account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());


        return new UserLoginResponse(
                token,
                "Login successful",
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }

}