package com.shopverse.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.shopverse.dto.CustomResponse;
import com.shopverse.entity.Product;
import com.shopverse.service.ProductService;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public CustomResponse<Product> addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/category/{categorySlug}")
    public List<Product> getProductsByCategory(@PathVariable String categorySlug) {
        return productService.getProductsByCategory(categorySlug);
    }

}