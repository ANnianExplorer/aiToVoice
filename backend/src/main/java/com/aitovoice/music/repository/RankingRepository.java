package com.aitovoice.music.repository;

import com.aitovoice.music.entity.Ranking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RankingRepository extends JpaRepository<Ranking, Long> {
    List<Ranking> findByTypeAndPeriodAndDeletedAtIsNullOrderByRankPositionAsc(
            Ranking.RankingType type, Ranking.Period period);
    List<Ranking> findByTypeAndGenreIdAndPeriodAndDeletedAtIsNullOrderByRankPositionAsc(
            Ranking.RankingType type, Long genreId, Ranking.Period period);
}
