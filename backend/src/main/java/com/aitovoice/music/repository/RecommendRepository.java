package com.aitovoice.music.repository;

import com.aitovoice.music.entity.Recommendation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface RecommendRepository extends JpaRepository<Recommendation, Long> {
    @Query("SELECT r FROM Recommendation r LEFT JOIN FETCH r.song WHERE r.user.id = :userId AND r.deletedAt IS NULL ORDER BY r.score DESC")
    List<Recommendation> findByUserIdAndDeletedAtIsNullOrderByScoreDesc(Long userId, Pageable pageable);

    Optional<Recommendation> findByUserIdAndSongIdAndDeletedAtIsNull(Long userId, Long songId);
}
