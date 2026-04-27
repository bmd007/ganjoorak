package io.github.bmd007.poem.ganjoorak.repository;

import io.github.bmd007.poem.ganjoorak.model.Category;
import io.github.bmd007.poem.ganjoorak.model.Poem;
import io.github.bmd007.poem.ganjoorak.model.Poet;
import io.github.bmd007.poem.ganjoorak.model.Verse;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class GanjoorRepository {
    private final JdbcClient jdbc;

    public GanjoorRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<Poet> findAllPoets() {
        return jdbc.sql("SELECT id, name, cat_id, description FROM poet ORDER BY id")
                .query((rs, _) -> new Poet(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getInt("cat_id"),
                        rs.getString("description")))
                .list();
    }

    public Optional<Poet> findPoetById(int id) {
        return jdbc.sql("SELECT id, name, cat_id, description FROM poet WHERE id = :id")
                .param("id", id)
                .query((rs, _) -> new Poet(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getInt("cat_id"),
                        rs.getString("description")))
                .optional();
    }

    public List<Category> findCategoriesByPoetId(int poetId) {
        return jdbc.sql("SELECT id, poet_id, text, parent_id, url FROM cat WHERE poet_id = :poetId ORDER BY id")
                .param("poetId", poetId)
                .query((rs, _) -> new Category(
                        rs.getInt("id"),
                        rs.getInt("poet_id"),
                        rs.getString("text"),
                        rs.getInt("parent_id"),
                        rs.getString("url")))
                .list();
    }

    public Optional<Category> findCategoryById(int id) {
        return jdbc.sql("SELECT id, poet_id, text, parent_id, url FROM cat WHERE id = :id")
                .param("id", id)
                .query((rs, _) -> new Category(
                        rs.getInt("id"),
                        rs.getInt("poet_id"),
                        rs.getString("text"),
                        rs.getInt("parent_id"),
                        rs.getString("url")))
                .optional();
    }

    public List<Category> findSubcategories(int parentId) {
        return jdbc.sql("SELECT id, poet_id, text, parent_id, url FROM cat WHERE parent_id = :parentId ORDER BY id")
                .param("parentId", parentId)
                .query((rs, _) -> new Category(
                        rs.getInt("id"),
                        rs.getInt("poet_id"),
                        rs.getString("text"),
                        rs.getInt("parent_id"),
                        rs.getString("url")))
                .list();
    }

    public List<Poem> findPoemsByCategoryId(int catId) {
        return jdbc.sql("SELECT id, cat_id, title, url FROM poem WHERE cat_id = :catId ORDER BY id")
                .param("catId", catId)
                .query((rs, _) -> new Poem(
                        rs.getInt("id"),
                        rs.getInt("cat_id"),
                        rs.getString("title"),
                        rs.getString("url")))
                .list();
    }

    public Optional<Poem> findPoemById(int id) {
        return jdbc.sql("SELECT id, cat_id, title, url FROM poem WHERE id = :id")
                .param("id", id)
                .query((rs, _) -> new Poem(
                        rs.getInt("id"),
                        rs.getInt("cat_id"),
                        rs.getString("title"),
                        rs.getString("url")))
                .optional();
    }

    public List<Verse> findVersesByPoemId(int poemId) {
        return jdbc.sql("SELECT poem_id, vorder, position, text FROM verse WHERE poem_id = :poemId ORDER BY vorder")
                .param("poemId", poemId)
                .query((rs, _) -> new Verse(
                        rs.getInt("poem_id"),
                        rs.getInt("vorder"),
                        rs.getInt("position"),
                        rs.getString("text")))
                .list();
    }

    public Optional<Poem> findRandomPoem() {
        return jdbc.sql("SELECT id, cat_id, title, url FROM poem ORDER BY RANDOM() LIMIT 1")
                .query((rs, _) -> new Poem(
                        rs.getInt("id"),
                        rs.getInt("cat_id"),
                        rs.getString("title"),
                        rs.getString("url")))
                .optional();
    }

    public List<Map<String, Object>> searchPoems(String query, int limit) {
        return jdbc.sql("""
                        SELECT p.id, p.title, p.url, pt.name AS poet_name, pt.id AS poet_id
                        FROM poem p
                        JOIN cat c ON p.cat_id = c.id
                        JOIN poet pt ON c.poet_id = pt.id
                        WHERE p.title LIKE :query
                        LIMIT :limit""")
                .param("query", query)
                .param("limit", limit)
                .query((rs, _) -> Map.<String, Object>of(
                        "id", rs.getInt("id"),
                        "title", rs.getString("title"),
                        "url", rs.getString("url"),
                        "poetName", rs.getString("poet_name"),
                        "poetId", rs.getInt("poet_id")))
                .list();
    }

    public List<Map<String, Object>> searchVerses(String query, int limit) {
        return jdbc.sql("""
                        SELECT DISTINCT v.poem_id, v.text, p.title, pt.name AS poet_name, pt.id AS poet_id
                        FROM verse v
                        JOIN poem p ON v.poem_id = p.id
                        JOIN cat c ON p.cat_id = c.id
                        JOIN poet pt ON c.poet_id = pt.id
                        WHERE v.text LIKE :query
                        LIMIT :limit""")
                .param("query", query)
                .param("limit", limit)
                .query((rs, _) -> Map.<String, Object>of(
                        "poemId", rs.getInt("poem_id"),
                        "text", rs.getString("text"),
                        "title", rs.getString("title"),
                        "poetName", rs.getString("poet_name"),
                        "poetId", rs.getInt("poet_id")))
                .list();
    }

    public int countPoemsByCategoryId(int catId) {
        return jdbc.sql("SELECT COUNT(*) FROM poem WHERE cat_id = :catId")
                .param("catId", catId)
                .query((rs, _) -> rs.getInt(1))
                .single();
    }
}
