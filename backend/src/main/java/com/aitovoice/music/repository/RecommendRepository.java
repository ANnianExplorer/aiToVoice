package com.aitovoice.music.repository;

import com.aitovoice.music.entity.Recommendation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecommendRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByUserIdAndDeletedAtIsNullOrderByScoreDesc(Long userId, Pageable pageable);
}
