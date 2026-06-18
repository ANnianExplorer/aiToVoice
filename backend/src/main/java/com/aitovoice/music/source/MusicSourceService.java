package com.aitovoice.music.source;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 聚合多个音乐源，去重返回统一结果
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MusicSourceService {

    private final List<MusicSourceProvider> providers;

    /** 搜索所有可用源 */
    public List<ExternalTrack> searchAll(String keyword, int limitPerSource) {
        var all = new ArrayList<ExternalTrack>();
        for (var provider : providers) {
            if (!provider.isAvailable()) continue;
            try {
                var results = provider.search(keyword, limitPerSource);
                all.addAll(results);
            } catch (Exception e) {
                log.warn("Search failed for {}: {}", provider.getName(), e.getMessage());
            }
        }
        return all;
    }

    /** 获取热门歌曲（仅第一个可用源） */
    public List<ExternalTrack> getTrending(int limit) {
        for (var provider : providers) {
            if (!provider.isAvailable()) continue;
            try {
                return provider.getTrending(limit);
            } catch (Exception e) {
                log.warn("Trending failed for {}: {}", provider.getName(), e.getMessage());
            }
        }
        return List.of();
    }

    /** 根据源名称和 ID 获取流式 URL */
    public String getStreamUrl(String source, String trackId) {
        for (var provider : providers) {
            if (provider.getName().equalsIgnoreCase(source) && provider.isAvailable()) {
                return provider.getStreamUrl(trackId);
            }
        }
        return null;
    }

    /** 根据源名称和 ID 获取详情 */
    public ExternalTrack getTrackDetail(String source, String trackId) {
        for (var provider : providers) {
            if (provider.getName().equalsIgnoreCase(source) && provider.isAvailable()) {
                return provider.getTrackDetail(trackId);
            }
        }
        return null;
    }

    /** 获取所有可用源名称 */
    public List<String> getAvailableSources() {
        return providers.stream()
                .filter(MusicSourceProvider::isAvailable)
                .map(MusicSourceProvider::getName)
                .toList();
    }
}
