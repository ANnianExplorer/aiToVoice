package com.aitovoice.voice.repository;

import com.aitovoice.voice.entity.AiMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface AiMessageRepository extends JpaRepository<AiMessage, Long> {
    @Query("SELECT m FROM AiMessage m WHERE m.session.id = :sessionId ORDER BY m.createdAt ASC")
    List<AiMessage> findBySessionIdOrderByCreatedAtAsc(Long sessionId);
}
