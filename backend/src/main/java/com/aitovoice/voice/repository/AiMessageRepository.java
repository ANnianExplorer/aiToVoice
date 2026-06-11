package com.aitovoice.voice.repository;

import com.aitovoice.voice.entity.AiMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiMessageRepository extends JpaRepository<AiMessage, Long> {
    List<AiMessage> findBySessionIdOrderByCreatedAtAsc(Long sessionId);
}
