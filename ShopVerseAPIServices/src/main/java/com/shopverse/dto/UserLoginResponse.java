package com.shopverse.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserLoginResponse {

    private String token;
    private String message;
    private String userId;
    private String name;
    private String email;
    private String role;

    // constructors/getters/setters
}