package com.shopverse.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.shopverse.entity.UserRegistration;

@Repository
public interface UserRegistrationRepository extends MongoRepository<UserRegistration, String> {

    Optional<UserRegistration> findByEmail(String email);

    boolean existsByEmail(String email);

}