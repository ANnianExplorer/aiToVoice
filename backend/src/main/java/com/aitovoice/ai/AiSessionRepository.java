package com.aitovoice.ai;

import com.aitovoice.ai.entity.AiSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiSessionRepository extends JpaRepository<AiSession, Long> {
    List<AiSession> findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long userId);
}
