package com.shopverse.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String productName;

    private String description;

    private Double price;

    private Double discountPrice;

    private String brand;

    private Integer stock;

    private List<String> images;

    private String categorySlug;

    private Boolean featured;

    private Boolean topDeal;

    private Boolean trending;

    private Double rating;

    private Boolean active;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;
}