package io.github.bmd007.poem.ganjoorak.controller;

import io.github.bmd007.poem.ganjoorak.model.Verse;
import io.github.bmd007.poem.ganjoorak.repository.GanjoorRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api")
class ChatController {
    private final ChatClient chatClient;
    private final GanjoorRepository repo;

    ChatController(ChatClient.Builder chatClientBuilder, GanjoorRepository repo) {
        this.chatClient = chatClientBuilder.build();
        this.repo = repo;
    }

    record ChatMessage(String role, String content) {}
    record ChatRequest(String message, List<ChatMessage> history) {}

    @PostMapping(value = "/poems/{id}/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    Flux<String> chat(@PathVariable int id, @RequestBody ChatRequest request) {
        var poem = repo.findPoemById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND));
        var verses = repo.findVersesByPoemId(id);
        var category = repo.findCategoryById(poem.catId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND));
        var poet = repo.findPoetById(category.poetId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND));
        var poemText = verses.stream()
                .map(Verse::text)
                .collect(Collectors.joining("\n"));
        var systemPrompt = """
                You are a knowledgeable Persian poetry scholar. You are discussing this poem:

                Poet: %s
                Title: %s

                %s

                Answer in Persian (Farsi). Discuss meaning, literary devices, historical context, \
                and the poet's style. Be concise and insightful."""
                .formatted(poet.name(), poem.title(), poemText);
        var messages = new ArrayList<Message>();
        messages.add(new SystemMessage(systemPrompt));
        if (request.history() != null) {
            for (var msg : request.history()) {
                messages.add(msg.role().equals("user")
                        ? new UserMessage(msg.content())
                        : new AssistantMessage(msg.content()));
            }
        }
        messages.add(new UserMessage(request.message()));
        return chatClient.prompt()
                .messages(messages)
                .stream()
                .content();
    }
}
