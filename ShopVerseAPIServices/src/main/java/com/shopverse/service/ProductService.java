package com.shopverse.service;
import java.util.List;

import com.shopverse.dto.CustomResponse;
import com.shopverse.entity.Product;


public interface ProductService {

    CustomResponse<Product> addProduct(Product product);

    List<Product> getAllProducts();

    List<Product> getProductsByCategory(String categorySlug);

}