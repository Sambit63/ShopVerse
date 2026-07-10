package com.shopverse.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserRegistrationRequest {

    private String firstName;

    private String lastName;

    private String email;

    private String mobileNumber;

    private String password;

}