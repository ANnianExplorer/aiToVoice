package com.aitovoice.config;

import com.aitovoice.music.entity.Artist;
import com.aitovoice.music.entity.Genre;
import com.aitovoice.music.entity.Song;
import com.aitovoice.music.repository.ArtistRepository;
import com.aitovoice.music.repository.GenreRepository;
import com.aitovoice.music.repository.SongRepository;
import com.aitovoice.music.source.AudiusProvider;
import com.aitovoice.music.source.ExternalTrack;
import com.aitovoice.music.source.MusicSourceProvider;
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
 */
@Slf4j
@Component
@Order(3) // EnumColumnFixer(1) 之后运行
@RequiredArgsConstructor
public class MusicDataInitializer implements ApplicationRunner {

    private final AudiusProvider audiusProvider;
    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;

    // 缓存已创建的艺术家，避免重复查询
    private final Map<String, Artist> artistCache = new HashMap<>();
    private final Map<String, Genre> genreCache = new HashMap<>();

    @Override
    public void run(ApplicationArguments args) {
        syncProvider(audiusProvider, Song.SourceType.AUDIUS, 50);
    }

    private void syncProvider(MusicSourceProvider provider, Song.SourceType sourceType, int limit) {
        long count = songRepository.countBySourceType(sourceType);
        if (count >= 20) {
            log.info("已有 {} 首 {} 歌曲，跳过同步", count, sourceType);
            return;
        }
        if (!provider.isAvailable()) {
            log.info("{} 不可用，跳过同步", sourceType);
            return;
        }
        log.info("开始从 {} 同步热门歌曲...", sourceType);
        try {
            var tracks = provider.getTrending(limit);
            int saved = 0;
            for (var track : tracks) {
                try {
                    if (existsBySourceId(track.sourceId())) continue;
                    saveTrack(track);
                    saved++;
                } catch (Exception e) {
                    log.debug("跳过单曲 {}: {}", track.title(), e.getMessage());
                }
            }
            log.info("{} 同步完成：新增 {} 首歌曲", sourceType, saved);
        } catch (Exception e) {
            log.warn("{} 同步失败: {}", sourceType, e.getMessage());
        }
    }

    @Transactional
    public void saveTrack(ExternalTrack track) {
        var artist = findOrCreateArtist(track.artistName());
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
        if (artistCache.containsKey(name)) return artistCache.get(name);
        var artist = artistRepository.findByName(name).orElseGet(() -> {
            var a = Artist.builder()
                    .name(name)
                    .sourceType(Artist.SourceType.AUDIUS)
                    .build();
            return artistRepository.save(a);
        });
        artistCache.put(name, artist);
        return artist;
    }

    private Genre findOrCreateGenre(String genreName) {
        if (genreName == null || genreName.isBlank()) {
            return genreRepository.findAll().stream().findFirst().orElse(null);
        }
        if (genreCache.containsKey(genreName)) return genreCache.get(genreName);
        var genre = genreRepository.findByName(genreName).orElseGet(() -> {
            var g = new Genre();
            g.setName(genreName);
            g.setDescription(genreName + " music");
            g.setSortOrder(99);
            return genreRepository.save(g);
        });
        genreCache.put(genreName, genre);
        return genre;
    }

    private boolean existsBySourceId(String sourceId) {
        return songRepository.findBySourceIdAndSourceType(sourceId, Song.SourceType.AUDIUS).isPresent();
    }
}
