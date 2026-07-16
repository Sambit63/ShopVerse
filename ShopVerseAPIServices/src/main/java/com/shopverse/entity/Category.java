package com.shopverse.entity;

import java.time.LocalDateTime;

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
@Document(collection = "categories")
public class Category {

    @Id
    private String id;

    private String categoryName;

    private String categorySlug;

    private String description;

    private Integer displayOrder;

    private Boolean active;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;
}