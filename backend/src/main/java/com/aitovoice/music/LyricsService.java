package com.aitovoice.music;

import com.aitovoice.music.entity.Lyrics;
import com.aitovoice.music.entity.Song;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class LyricsService {

    private final LyricsRepository lyricsRepository;
    private static final Pattern LRC_TIME_PATTERN = Pattern.compile("\\[(\\d{2}):(\\d{2})\\.(\\d{2,3})\\](.*)");

    public String getLyrics(Long songId) {
        return lyricsRepository.findBySongId(songId)
                .map(Lyrics::getContent)
                .orElse(null);
    }

    @Transactional
    public void saveLyrics(Long songId, String content, String source) {
        var lyrics = lyricsRepository.findBySongId(songId)
                .orElseGet(() -> Lyrics.builder()
                        .song(Song.builder().id(songId).build())
                        .build());
        lyrics.setContent(content);
        lyrics.setSource(source);
        lyrics.setSyncedAt(LocalDateTime.now());
        lyricsRepository.save(lyrics);
    }

    public Map<Long, String> parseLrc(String lrcContent) {
        var result = new LinkedHashMap<Long, String>();
        if (lrcContent == null) return result;

        for (var line : lrcContent.split("\n")) {
            var matcher = LRC_TIME_PATTERN.matcher(line);
            while (matcher.find()) {
                var min = Long.parseLong(matcher.group(1));
                var sec = Long.parseLong(matcher.group(2));
                var ms = Long.parseLong(matcher.group(3));
                var text = matcher.group(4).trim();
                var timeMs = (min * 60 + sec) * 1000 + ms;
                if (!text.isEmpty()) {
                    result.put(timeMs, text);
                }
            }
        }
        return result;
    }
}
