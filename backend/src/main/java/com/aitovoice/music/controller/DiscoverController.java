package com.aitovoice.music.controller;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.music.mapper.SongMapper;
import com.aitovoice.music.repository.ArtistRepository;
import com.aitovoice.music.repository.GenreRepository;
import com.aitovoice.music.repository.SongRepository;
import com.aitovoice.music.source.MusicSourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 发现页聚合 API — 一次请求返回首页所有板块数据
 */
@RestController
@RequestMapping("/api/discover")
@RequiredArgsConstructor
public class DiscoverController {

    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;
    private final MusicSourceService musicSourceService;
    private final SongMapper songMapper;

    /** 发现页全部数据 */
    @GetMapping
    public ApiResponse<Map<String, Object>> discover() {
        var data = new LinkedHashMap<String, Object>();

        // 1. 热门歌曲（按播放量）
        var hot = songRepository.findHotSongs(PageRequest.of(0, 12))
                .stream().map(songMapper::toDto).toList();
        data.put("hotSongs", hot);

        // 2. 新歌速递
        var newSongs = songRepository.findNewSongs(PageRequest.of(0, 12))
                .stream().map(songMapper::toDto).toList();
        data.put("newSongs", newSongs);

        // 3. 热门歌手
        var artists = artistRepository.findAll().stream()
                .limit(12)
                .map(a -> {
                    var m = new java.util.LinkedHashMap<String, Object>();
                    m.put("id", a.getId());
                    m.put("name", a.getName());
                    return m;
                })
                .toList();
        data.put("artists", artists);

        // 4. 流派列表
        var genres = genreRepository.findAllByOrderBySortOrderAsc().stream()
                .map(g -> Map.<String, Object>of("id", g.getId(), "name", g.getName()))
                .toList();
        data.put("genres", genres);

        // 5. 各流派热门（每个流派前 6 首）
        var genreHot = new LinkedHashMap<String, List<SongDto>>();
        for (var genre : genreRepository.findAllByOrderBySortOrderAsc()) {
            var songs = songRepository.findByGenreId(genre.getId(), PageRequest.of(0, 6))
                    .stream().map(songMapper::toDto).toList();
            if (!songs.isEmpty()) {
                genreHot.put(genre.getName(), songs);
            }
        }
        data.put("genreHot", genreHot);

        return ApiResponse.success(data);
    }
}
