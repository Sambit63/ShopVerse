package com.shopverse.service;
import java.util.List;

import com.shopverse.dto.CustomResponse;
import com.shopverse.entity.Category;


public interface CategoryService {

    CustomResponse<Category> addCategory(Category category);

    List<Category> getAllCategories();

}
