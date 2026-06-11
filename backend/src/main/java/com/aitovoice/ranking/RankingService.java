package com.aitovoice.ranking;

import com.aitovoice.music.SongMapper;
import com.aitovoice.ranking.dto.RankingDto;
import com.aitovoice.ranking.entity.Ranking;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final RankingRepository rankingRepository;
    private final SongMapper songMapper;

    public List<RankingDto> getHot() {
        return getRanking(Ranking.RankingType.HOT, Ranking.Period.DAILY);
    }

    public List<RankingDto> getNew() {
        return getRanking(Ranking.RankingType.NEW, Ranking.Period.DAILY);
    }

    public List<RankingDto> getRising() {
        return getRanking(Ranking.RankingType.RISING, Ranking.Period.DAILY);
    }

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
