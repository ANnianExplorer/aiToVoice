package com.aitovoice.voice.repository;

import com.aitovoice.voice.entity.AiSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiSessionRepository extends JpaRepository<AiSession, Long> {
    List<AiSession> findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
