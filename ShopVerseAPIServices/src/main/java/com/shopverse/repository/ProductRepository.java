package com.shopverse.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.shopverse.entity.Product;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findByCategorySlug(String categorySlug);

    List<Product> findByFeaturedTrue();

    List<Product> findByTopDealTrue();

    List<Product> findByTrendingTrue();

    List<Product> findByActiveTrue();
    
 // Case-insensitive check to make sure "Nike" and "nike" are treated as the same brand
    boolean existsByProductNameIgnoreCaseAndBrandIgnoreCase(String productName, String brand);
}