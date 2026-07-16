package com.shopverse.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shopverse.dto.CustomResponse;
import com.shopverse.entity.Category;
import com.shopverse.repository.CategoryRepository;
import com.shopverse.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public CustomResponse<Category> addCategory(Category category) {
        // 1. Validation check for duplicate category name
        if (categoryRepository.existsByCategoryName(category.getCategoryName())) {
            return CustomResponse.error("Category with name '" + category.getCategoryName() + "' already exists.");
        }

        // 2. Set current timestamps
        LocalDateTime now = LocalDateTime.now();
        category.setCreatedDate(now);
        category.setUpdatedDate(now);
        
        // 3. Save the category
        Category savedCategory = categoryRepository.save(category);

        // 4. Return the wrapped success response
        return CustomResponse.success("Category added successfully.", savedCategory);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}