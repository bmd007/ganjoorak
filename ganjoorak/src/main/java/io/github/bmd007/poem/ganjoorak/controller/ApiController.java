package io.github.bmd007.poem.ganjoorak.controller;

import io.github.bmd007.poem.ganjoorak.model.Category;
import io.github.bmd007.poem.ganjoorak.model.Poem;
import io.github.bmd007.poem.ganjoorak.model.Poet;
import io.github.bmd007.poem.ganjoorak.model.Verse;
import io.github.bmd007.poem.ganjoorak.repository.GanjoorRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api")
class ApiController {
    private final GanjoorRepository repo;

    ApiController(GanjoorRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/poets")
    List<Poet> listPoets() {
        return repo.findAllPoets();
    }

    @GetMapping("/poets/{id}")
    Map<String, Object> getPoet(@PathVariable int id) {
        var poet = repo.findPoetById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Poet not found"));
        var rootCat = repo.findCategoryById(poet.catId());
        var categories = repo.findSubcategories(poet.catId());
        var slug = rootCat.map(c -> c.url().substring(c.url().lastIndexOf('/') + 1)).orElse("");
        return Map.of("poet", poet, "categories", categories, "slug", slug);
    }

    @GetMapping("/categories/{id}")
    Map<String, Object> getCategory(@PathVariable int id) {
        var category = repo.findCategoryById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Category not found"));
        var subcategories = repo.findSubcategories(id);
        var poems = repo.findPoemsByCategoryId(id);
        var poemCount = repo.countPoemsByCategoryId(id);
        var breadcrumb = buildBreadcrumb(id);
        return Map.of(
                "category", category,
                "subcategories", subcategories,
                "poems", poems,
                "poemCount", poemCount,
                "breadcrumb", breadcrumb);
    }

    @GetMapping("/poems/{id}")
    Map<String, Object> getPoem(@PathVariable int id) {
        return buildPoemResponse(id);
    }

    @GetMapping("/poems/random")
    Map<String, Object> getRandomPoem() {
        var poem = repo.findRandomPoem()
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "No poems found"));
        return buildPoemResponse(poem.id());
    }

    @GetMapping("/search")
    Map<String, Object> search(@RequestParam String q, @RequestParam(defaultValue = "50") int limit) {
        var wrappedQuery = "%" + q + "%";
        var poems = repo.searchPoems(wrappedQuery, limit);
        var verses = repo.searchVerses(wrappedQuery, limit);
        return Map.of("poems", poems, "verses", verses);
    }

    private Map<String, Object> buildPoemResponse(int poemId) {
        var poem = repo.findPoemById(poemId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Poem not found"));
        var verses = repo.findVersesByPoemId(poemId);
        var category = repo.findCategoryById(poem.catId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Category not found"));
        var poet = repo.findPoetById(category.poetId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Poet not found"));
        var breadcrumb = buildBreadcrumb(poem.catId());
        return Map.of(
                "poem", poem,
                "verses", verses,
                "poet", poet,
                "category", category,
                "breadcrumb", breadcrumb);
    }

    private List<Category> buildBreadcrumb(int categoryId) {
        var breadcrumb = new ArrayList<Category>();
        var current = categoryId;
        while (current > 0) {
            var cat = repo.findCategoryById(current);
            if (cat.isEmpty()) break;
            breadcrumb.addFirst(cat.get());
            current = cat.get().parentId();
        }
        return breadcrumb;
    }
}
