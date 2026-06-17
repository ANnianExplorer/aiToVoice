package com.aitovoice.music.service;

import com.aitovoice.music.mapper.SongMapper;
import com.aitovoice.music.dto.RankingDto;
import com.aitovoice.music.entity.Ranking;
import com.aitovoice.music.repository.RankingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final RankingRepository rankingRepository;
    private final SongMapper songMapper;

    @Transactional(readOnly = true)
    public List<RankingDto> getHot() {
        return getRanking(Ranking.RankingType.HOT, Ranking.Period.DAILY);
    }

    @Transactional(readOnly = true)
    public List<RankingDto> getNew() {
        return getRanking(Ranking.RankingType.NEW, Ranking.Period.DAILY);
    }

    @Transactional(readOnly = true)
    public List<RankingDto> getRising() {
        return getRanking(Ranking.RankingType.RISING, Ranking.Period.DAILY);
    }

    @Transactional(readOnly = true)
    public List<RankingDto> getByGenre(Long genreId) {
        return rankingRepository.findByTypeAndGenreIdAndPeriodAndDeletedAtIsNullOrderByRankPositionAsc(
                Ranking.RankingType.GENRE, genreId, Ranking.Period.DAILY).stream()
                .map(r -> new RankingDto(r.getRankPosition(), songMapper.toDto(r.getSong()), r.getScore()))
                .toList();
    }

    private List<RankingDto> getRanking(Ranking.RankingType type, Ranking.Period period) {
        return rankingRepository.findByTypeAndPeriodAndDeletedAtIsNullOrderByRankPositionAsc(type, period).stream()
                .map(r -> new RankingDto(r.getRankPosition(), songMapper.toDto(r.getSong()), r.getScore()))
                .toList();
    }
}
