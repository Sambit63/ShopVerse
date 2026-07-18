package com.shopverse.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "user_registration")
public class UserRegistration {

    @Id
    private String id;

    private String fullName;

    private String email;

    private String mobileNumber;

    private String password;

    private String role;

    private Boolean active;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

}