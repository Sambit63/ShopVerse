package com.shopverse.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopverse.dto.CustomResponse;
import com.shopverse.entity.Product;
import com.shopverse.repository.ProductRepository;
import com.shopverse.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

	@Autowired
	private ProductRepository productRepository;

	@Override
	public CustomResponse<Product> addProduct(Product product) {
		// 1. Check if the product with same name and brand exists (case-insensitive)
		boolean productExists = productRepository
				.existsByProductNameIgnoreCaseAndBrandIgnoreCase(product.getProductName(), product.getBrand());

		if (productExists) {
			return CustomResponse.error("Product with name '" + product.getProductName()
					+ "' already exists with the brand name '" + product.getBrand() + "'");
		}

		// 3. Set audit dates and save
		product.setCreatedDate(LocalDateTime.now());
		product.setUpdatedDate(LocalDateTime.now());
		productRepository.save(product);
		return CustomResponse.success("Product added sucessfully", productRepository.save(product));
	}

	@Override
	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	@Override
	public List<Product> getProductsByCategory(String categorySlug) {
		return productRepository.findByCategorySlug(categorySlug);
	}

}
