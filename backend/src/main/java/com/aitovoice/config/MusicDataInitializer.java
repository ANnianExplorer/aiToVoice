package com.aitovoice.config;

import com.aitovoice.music.entity.Artist;
import com.aitovoice.music.entity.Genre;
import com.aitovoice.music.entity.Song;
import com.aitovoice.music.repository.ArtistRepository;
import com.aitovoice.music.repository.GenreRepository;
import com.aitovoice.music.repository.SongRepository;
import com.aitovoice.music.source.AudiusProvider;
import com.aitovoice.music.source.ExternalTrack;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * 应用启动时从 Audius 拉取热门歌曲存入本地数据库
 * 确保即使 Audius 不可用，本地也有数据
 */
@Slf4j
@Component
@Order(2) // 在 DataInitializer 之后运行
@RequiredArgsConstructor
public class MusicDataInitializer implements ApplicationRunner {

    private final AudiusProvider audiusProvider;
    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // 检查是否已有 Audius 来源的歌曲
        long audiusCount = songRepository.countBySourceType(Song.SourceType.AUDIUS);
        if (audiusCount >= 20) {
            log.info("已有 {} 首 Audius 歌曲，跳过同步", audiusCount);
            return;
        }

        if (!audiusProvider.isAvailable()) {
            log.warn("Audius 不可用，跳过同步");
            return;
        }

        log.info("开始从 Audius 同步热门歌曲...");

        try {
            var tracks = audiusProvider.getTrending(50);
            int saved = 0;

            for (var track : tracks) {
                if (existsBySourceId(track.sourceId())) continue;
                saveTrack(track);
                saved++;
            }

            log.info("Audius 同步完成：新增 {} 首歌曲", saved);
        } catch (Exception e) {
            log.warn("Audius 同步失败: {}", e.getMessage());
        }
    }

    private boolean existsBySourceId(String sourceId) {
        return songRepository.findBySourceIdAndSourceType(sourceId, Song.SourceType.AUDIUS).isPresent();
    }

    private void saveTrack(ExternalTrack track) {
        // 查找或创建艺术家
        var artist = findOrCreateArtist(track.artistName());

        // 查找或创建流派
        var genre = findOrCreateGenre(track.genre());

        var song = Song.builder()
                .title(track.title())
                .artist(artist)
                .genre(genre)
                .duration(track.durationSec())
                .coverUrl(track.coverUrl())
                .sourceId(track.sourceId())
                .sourceType(Song.SourceType.AUDIUS)
                .streamUrl(track.streamUrl())
                .playCount((long) track.playCount())
                .build();
        songRepository.save(song);
    }

    private Artist findOrCreateArtist(String name) {
        return artistRepository.findByName(name).orElseGet(() -> {
            var a = Artist.builder()
                    .name(name)
                    .sourceType(Artist.SourceType.AUDIUS)
                    .build();
            return artistRepository.save(a);
        });
    }

    private Genre findOrCreateGenre(String genreName) {
        if (genreName == null || genreName.isBlank()) {
            return genreRepository.findAll().stream().findFirst().orElse(null);
        }
        return genreRepository.findByName(genreName).orElseGet(() -> {
            var g = new Genre();
            g.setName(genreName);
            g.setDescription(genreName + " music");
            g.setSortOrder(99);
            return genreRepository.save(g);
        });
    }
}
