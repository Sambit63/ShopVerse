package com.shopverse.admin.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.shopverse.admin.entity.Admin;

@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {

    Optional<Admin> findByEmail(String email);

    boolean existsByEmail(String email);
}