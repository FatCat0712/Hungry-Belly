package com.eddie.hungry_belly_backend.category;

import com.eddie.hungry_belly_backend.category.repository.CategoryRepository;
import com.eddie.hungry_belly_backend.entity.Category;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest(showSql = false)
@ActiveProfiles("test")
public class CategoryRepositoryTests {
    private final CategoryRepository categoryRepository;
    private final TestEntityManager testEntityManager;

    @Autowired
    public CategoryRepositoryTests(CategoryRepository categoryRepository, TestEntityManager testEntityManager) {
        this.categoryRepository = categoryRepository;
        this.testEntityManager = testEntityManager;
    }

    @BeforeEach
    void setUp() {
        Category food = new Category("Food");
        food.setAlias("food");
        food.setEnabled(true);
        testEntityManager.persist(food);

        Category drinks = new Category("Drinks");
        drinks.setAlias("drinks");
        drinks.setEnabled(true);
        testEntityManager.persist(drinks);

        testEntityManager.flush();
    }

    @Test
    public void testCreateRootCategory() {
        Category category = new Category("Seafood");
        category = categoryRepository.save(category);
        assertThat(category.getId()).isGreaterThan(0);
    }

    @Test
    public void testCreateSubCategory() {
        Category parent = categoryRepository.findByName("Food");
        Category subCategory = new Category("Vietnamese", parent);

        subCategory = categoryRepository.save(subCategory);

        Category savedSubCategory = categoryRepository.findById(subCategory.getId()).orElseThrow();
        assertThat(savedSubCategory.getParent()).isNotNull();
        assertThat(savedSubCategory.getParent().getId()).isEqualTo(parent.getId());
    }

    @Test
    public void testCreateSaveSubCategories() {
        Category parent = categoryRepository.findByName("Drinks");
        Category subCategory1 = new Category("Pho", parent);
        Category subCategory2 = new Category("Banh Mi", parent);
        Category subCategory3 = new Category("Com Tam", parent);

        categoryRepository.saveAll(List.of(subCategory1, subCategory2, subCategory3));
        testEntityManager.flush();
        testEntityManager.clear();

        parent = categoryRepository.findById(parent.getId()).orElseThrow();
        assertThat(parent.getChildren()).hasSize(3);
    }

    @Test
    public void testGetCategory() {
        Category parent = categoryRepository.findByName("Food");
        categoryRepository.save(new Category("Vietnamese", parent));
        testEntityManager.flush();
        testEntityManager.clear();

        Category category = categoryRepository.findById(parent.getId()).orElseThrow();
        Set<Category> children = category.getChildren();
        assertThat(children.size()).isGreaterThan(0);
    }

    @Test
    public void testPrintHierarchicalCategories() {
        Category parent = categoryRepository.findByName("Food");
        categoryRepository.saveAll(List.of(
                new Category("Vietnamese", parent),
                new Category("Thai", parent)
        ));

        List<Category> categories = categoryRepository.findAll();
        assertThat(categories).extracting(Category::getName)
                .contains("Food", "Drinks", "Vietnamese", "Thai");
    }


}
