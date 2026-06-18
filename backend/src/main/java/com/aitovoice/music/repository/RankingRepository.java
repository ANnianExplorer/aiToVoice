package com.aitovoice.music.repository;

import com.aitovoice.music.entity.Ranking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface RankingRepository extends JpaRepository<Ranking, Long> {
    @Query("SELECT r FROM Ranking r LEFT JOIN FETCH r.song LEFT JOIN FETCH r.song.artist WHERE r.type = :type AND r.period = :period AND r.deletedAt IS NULL ORDER BY r.rankPosition ASC")
    List<Ranking> findByTypeAndPeriodAndDeletedAtIsNullOrderByRankPositionAsc(
            Ranking.RankingType type, Ranking.Period period);

    @Query("SELECT r FROM Ranking r LEFT JOIN FETCH r.song LEFT JOIN FETCH r.song.artist WHERE r.type = :type AND r.genre.id = :genreId AND r.period = :period AND r.deletedAt IS NULL ORDER BY r.rankPosition ASC")
    List<Ranking> findByTypeAndGenreIdAndPeriodAndDeletedAtIsNullOrderByRankPositionAsc(
            Ranking.RankingType type, Long genreId, Ranking.Period period);
}
