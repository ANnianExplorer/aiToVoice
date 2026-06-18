package com.aitovoice.music.source;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
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
 * Audius 音乐源提供者
 * 零配置，全量播放，CORS 友好
 */
@Slf4j
@Component
public class AudiusProvider implements MusicSourceProvider {

    private static final String BASE_URL = "https://discoveryprovider.audius.co/v1";
    private static final String APP_NAME = "aitovoice";
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String getName() {
        return "AUDIUS";
    }

    @Override
    public boolean isAvailable() {
        return true; // 零配置，始终可用
    }

    @Override
    public List<ExternalTrack> search(String keyword, int limit) {
        var url = "%s/tracks/search?query=%s&limit=%d&app_name=%s".formatted(
                BASE_URL, encode(keyword), limit, APP_NAME);
        return fetchTracks(url);
    }

    @Override
    public List<ExternalTrack> getTrending(int limit) {
        var url = "%s/tracks/trending?limit=%d&app_name=%s".formatted(
                BASE_URL, limit, APP_NAME);
        return fetchTracks(url);
    }

    @Override
    public ExternalTrack getTrackDetail(String trackId) {
        var url = "%s/tracks/%s?app_name=%s".formatted(BASE_URL, trackId, APP_NAME);
        try {
            var request = HttpRequest.newBuilder().uri(URI.create(url))
                    .timeout(Duration.ofSeconds(10)).GET().build();
            var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) return null;

            var root = mapper.readTree(response.body());
            var data = root.path("data");
            if (data.isMissingNode()) return null;
            return parseTrack(data);
        } catch (Exception e) {
            log.warn("Audius getTrackDetail failed: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public String getStreamUrl(String trackId) {
        return "%s/tracks/%s/stream?app_name=%s".formatted(BASE_URL, trackId, APP_NAME);
    }

    private List<ExternalTrack> fetchTracks(String url) {
        var tracks = new ArrayList<ExternalTrack>();
        try {
            var request = HttpRequest.newBuilder().uri(URI.create(url))
                    .timeout(Duration.ofSeconds(10)).GET().build();
            var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                log.warn("Audius API returned {}", response.statusCode());
                return tracks;
            }

            var root = mapper.readTree(response.body());
            var data = root.path("data");
            if (!data.isArray()) return tracks;

            for (var item : data) {
                var track = parseTrack(item);
                if (track != null) tracks.add(track);
            }
        } catch (Exception e) {
            log.warn("Audius search failed: {}", e.getMessage());
        }
        return tracks;
    }

    private ExternalTrack parseTrack(JsonNode node) {
        try {
            var id = node.path("id").asText(null);
            if (id == null) return null;

            var artwork = node.path("artwork");
            var coverUrl = artwork.path("480x480").asText(
                    artwork.path("150x150").asText(null));

            return new ExternalTrack(
                    id,
                    "AUDIUS",
                    node.path("title").asText(""),
                    node.path("user").path("name").asText("Unknown"),
                    null, // Audius 没有专辑概念
                    coverUrl,
                    getStreamUrl(id),
                    node.path("duration").asInt(0),
                    node.path("play_count").asInt(0),
                    node.path("genre").asText(null)
            );
        } catch (Exception e) {
            log.debug("Failed to parse Audius track: {}", e.getMessage());
            return null;
        }
    }

    private String encode(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }
}
