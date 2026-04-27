package io.github.bmd007.poem.ganjoorak.controller;

import io.github.bmd007.poem.ganjoorak.repository.GanjoorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
class AdminController {
    private final GanjoorRepository repo;

    AdminController(GanjoorRepository repo) {
        this.repo = repo;
    }

    record CreatePoetRequest(String name, String description) {}

    @PostMapping("/poets")
    Map<String, Object> createPoet(@RequestBody CreatePoetRequest request) {
        var slug = request.name().replaceAll("\\s+", "-");
        int catId = repo.insertCategory(0, request.name(), 0, "/" + slug);
        int poetId = repo.insertPoet(request.name(), request.description(), catId);
        repo.updateCategoryPoetId(catId, poetId);
        return Map.of("id", poetId, "catId", catId);
    }

    record Couplet(String first, String second) {}
    record CreatePoemRequest(int poetId, Integer categoryId, String title, List<Couplet> verses) {}

    @PostMapping("/poems")
    Map<String, Object> createPoem(@RequestBody CreatePoemRequest request) {
        var poet = repo.findPoetById(request.poetId())
                .orElseThrow(() -> new IllegalArgumentException("Poet not found"));
        int catId = request.categoryId() != null ? request.categoryId() : poet.catId();
        var slug = request.title().replaceAll("\\s+", "-");
        int poemId = repo.insertPoem(catId, request.title(), "/" + slug);
        int vorder = 0;
        for (var couplet : request.verses()) {
            repo.insertVerse(poemId, vorder, 0, couplet.first());
            repo.insertVerse(poemId, vorder, 1, couplet.second());
            vorder++;
        }
        return Map.of("id", poemId);
    }
}
