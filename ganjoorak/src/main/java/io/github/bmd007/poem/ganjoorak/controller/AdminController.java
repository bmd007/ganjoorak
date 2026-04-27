package io.github.bmd007.poem.ganjoorak.controller;

import io.github.bmd007.poem.ganjoorak.repository.GanjoorRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

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
    record CreatePoemRequest(int poetId, String title, List<Couplet> verses) {}

    @PostMapping("/poems")
    Map<String, Object> createPoem(@RequestBody CreatePoemRequest request) {
        repo.findPoetById(request.poetId())
                .orElseThrow(() -> new IllegalArgumentException("Poet not found"));
        int catId = repo.findOrCreateInformalCategory(request.poetId());
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

    @PutMapping("/poems/{id}")
    Map<String, Object> updatePoem(@PathVariable int id, @RequestBody CreatePoemRequest request) {
        requireInformal(id);
        var slug = request.title().replaceAll("\\s+", "-");
        repo.updatePoem(id, request.title(), "/" + slug);
        repo.deleteVersesByPoemId(id);
        int vorder = 0;
        for (var couplet : request.verses()) {
            repo.insertVerse(id, vorder, 0, couplet.first());
            repo.insertVerse(id, vorder, 1, couplet.second());
            vorder++;
        }
        return Map.of("id", id);
    }

    @DeleteMapping("/poems/{id}")
    Map<String, Object> deletePoem(@PathVariable int id) {
        requireInformal(id);
        repo.deleteVersesByPoemId(id);
        repo.deletePoem(id);
        return Map.of("deleted", id);
    }

    private void requireInformal(int poemId) {
        repo.findPoemById(poemId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND));
        if (!repo.isPoemInformal(poemId)) {
            throw new ResponseStatusException(FORBIDDEN, "Only informal poems can be modified");
        }
    }
}
