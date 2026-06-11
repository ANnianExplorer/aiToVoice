package com.aitovoice.recommend;

import com.aitovoice.music.SongMapper;
import com.aitovoice.music.SongRepository;
import com.aitovoice.music.dto.SongDto;
import com.aitovoice.recommend.dto.RecommendDto;
import com.aitovoice.recommend.entity.Recommendation;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendService {

    private final RecommendRepository recommendRepository;
    private final SongRepository songRepository;
    private final SongMapper songMapper;

    public List<RecommendDto> getDailyRecommend(Long userId) {
        return recommendRepository.findByUserIdAndDeletedAtIsNullOrderByScoreDesc(
                userId, PageRequest.of(0, 30)).stream()
                .map(r -> new RecommendDto(songMapper.toDto(r.getSong()), r.getScore(),
                        r.getReason(), r.getAlgorithm().name()))
                .toList();
    }

    public SongDto getRandomForFM(Long userId) {
        var songs = songRepository.findAll(PageRequest.of(0, 100)).getContent();
        if (songs.isEmpty()) return null;
        var random = songs.get((int) (Math.random() * songs.size()));
        return songMapper.toDto(random);
    }

    public List<SongDto> getSimilar(Long songId) {
        var song = songRepository.findById(songId).orElse(null);
        if (song == null || song.getGenre() == null) return List.of();
        return songRepository.findByGenreId(song.getGenre().getId(), PageRequest.of(0, 10)).stream()
                .map(songMapper::toDto).toList();
    }

    public void feedback(Long userId, Long songId, boolean liked) {
        var existing = recommendRepository.findByUserIdAndDeletedAtIsNullOrderByScoreDesc(
                userId, PageRequest.of(0, 100)).stream()
                .filter(r -> r.getSong().getId().equals(songId))
                .findFirst();
        existing.ifPresent(r -> {
            r.setScore(liked ? r.getScore() * 1.2 : r.getScore() * 0.5);
            r.setIsClicked(true);
            recommendRepository.save(r);
        });
    }
}
