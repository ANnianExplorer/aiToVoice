package com.aitovoice.music.controller;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.music.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreRepository genreRepository;

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        var genres = genreRepository.findAllByOrderBySortOrderAsc().stream()
                .map(g -> Map.<String, Object>of("id", g.getId(), "name", g.getName()))
                .toList();
        return ApiResponse.success(genres);
    }
}
