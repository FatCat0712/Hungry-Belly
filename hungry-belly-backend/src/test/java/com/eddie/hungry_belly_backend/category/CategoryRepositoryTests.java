package com.eddie.hungry_belly_backend.category;

import com.eddie.hungry_belly_backend.category.repository.CategoryRepository;
import com.eddie.hungry_belly_backend.entity.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest(showSql = false)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(value = false)
public class CategoryRepositoryTests {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryRepositoryTests(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Test
    public void testCreateRootCategory() {
        Category category = new Category("Food");
        category = categoryRepository.save(category);
        assertThat(category.getId()).isGreaterThan(0);
    }

    @Test
    public void testCreateSubCategory() {
        Category parent = new Category(1L);
        Category subCategory = new Category("Vietnamese", parent);

        subCategory = categoryRepository.save(subCategory);

        Category savedSubCategory = categoryRepository.findById(subCategory.getId()).orElseThrow();
        assertThat(savedSubCategory.getParent()).isNotNull();
        assertThat(savedSubCategory.getParent().getId()).isEqualTo(parent.getId());
    }

    @Test
    public void testCreateSaveSubCategories() {
        Category parent = new Category(2L);
        Category subCategory1 = new Category("Pho", parent);
        Category subCategory2 = new Category("Banh Mi", parent);
        Category subCategory3 = new Category("Com Tam", parent);

        categoryRepository.saveAll(List.of(subCategory1, subCategory2, subCategory3));

        parent = categoryRepository.findById(parent.getId()).orElseThrow();
        assertThat(parent.getChildren()).hasSize(3);
    }

    @Test
    public void testGetCategory() {
        Category category = categoryRepository.findById(1L).orElseThrow();
        System.out.println(category.getName());
        Set<Category> children = category.getChildren();
        children.forEach(sub -> System.out.println("--" + sub.getName()));
        assertThat(children.size()).isGreaterThan(0);
    }

    @Test
    public void testPrintHierarchicalCategories() {
        List<Category> categories = categoryRepository.findAll();

        for(Category category : categories) {
            if(category.getParent() == null) {
                System.out.println(category.getName());
                printChildren(category, 1);
            }
        }
    }

    private void printChildren(Category parent, int subLevel) {
        Set<Category> children = parent.getChildren();
        for(Category subCategory : children) {
            for(int i = 0; i < subLevel; i++) {
                System.out.print("--");
            }
            System.out.println(subCategory.getName());
            printChildren(subCategory, subLevel + 1);
        }
    }


}
