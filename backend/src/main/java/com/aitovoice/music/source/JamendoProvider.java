package com.aitovoice.music.source;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * Jamendo 音乐源 — CC 协议，免费音乐
 * 需要注册 client_id: https://developer.jamendo.com/
 */
@Slf4j
@Component
public class JamendoProvider implements MusicSourceProvider {

    private static final String BASE_URL = "https://api.jamendo.com/v3.0";
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10)).build();
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${music.jamendo.client-id:}")
    private String clientId;

    @Override
    public String getName() {
        return "JAMENDO";
    }

    @Override
    public boolean isAvailable() {
        return clientId != null && !clientId.isBlank();
    }

    @Override
    public List<ExternalTrack> search(String keyword, int limit) {
        var url = "%s/tracks/?client_id=%s&search=%s&limit=%d&format=json&include=musicinfo"
                .formatted(BASE_URL, clientId, encode(keyword), limit);
        return fetchTracks(url);
    }

    @Override
    public List<ExternalTrack> getTrending(int limit) {
        // Jamendo 按播放量排序
        var url = "%s/tracks/?client_id=%s&order=popularity_total&limit=%d&format=json&include=musicinfo"
                .formatted(BASE_URL, clientId, limit);
        return fetchTracks(url);
    }

    @Override
    public ExternalTrack getTrackDetail(String trackId) {
        var url = "%s/tracks/?client_id=%s&id=%s&format=json&include=musicinfo"
                .formatted(BASE_URL, clientId, trackId);
        var tracks = fetchTracks(url);
        return tracks.isEmpty() ? null : tracks.get(0);
    }

    @Override
    public String getStreamUrl(String trackId) {
        // Jamendo 流式播放 URL
        return "https://mp3d.jamendo.com/?trackid=%s&client_id=%s".formatted(trackId, clientId);
    }

    private List<ExternalTrack> fetchTracks(String url) {
        var tracks = new ArrayList<ExternalTrack>();
        try {
            var request = HttpRequest.newBuilder().uri(URI.create(url))
                    .timeout(Duration.ofSeconds(10)).GET().build();
            var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                log.warn("Jamendo API returned {}", response.statusCode());
                return tracks;
            }
            var root = mapper.readTree(response.body());
            var results = root.path("results");
            if (!results.isArray()) return tracks;
            for (var item : results) {
                var track = parseTrack(item);
                if (track != null) tracks.add(track);
            }
        } catch (Exception e) {
            log.warn("Jamendo search failed: {}", e.getMessage());
        }
        return tracks;
    }

    private ExternalTrack parseTrack(JsonNode node) {
        try {
            var id = node.path("id").asText(null);
            if (id == null) return null;

            var name = node.path("name").asText("");
            var artistName = node.path("artist_name").asText("Unknown");
            var albumName = node.path("album_name").asText(null);
            var duration = node.path("duration").asInt(0);
            var cover = node.path("album_image").asText(null);
            if (cover == null || cover.isBlank()) cover = node.path("image").asText(null);

            // 提取流派
            String genre = null;
            var musicinfo = node.path("musicinfo");
            if (!musicinfo.isMissingNode()) {
                var tags = musicinfo.path("tags").path("genres");
                if (tags.isArray() && !tags.isEmpty()) {
                    genre = tags.get(0).path("name").asText(null);
                }
            }

            return new ExternalTrack(
                    id, "JAMENDO", name, artistName, albumName,
                    cover, getStreamUrl(id), duration, 0, genre
            );
        } catch (Exception e) {
            log.debug("Failed to parse Jamendo track: {}", e.getMessage());
            return null;
        }
    }

    private String encode(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }
}
