package com.aitovoice.voice.repository;

import com.aitovoice.voice.entity.VoiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VoiceRecordRepository extends JpaRepository<VoiceRecord, Long> {
    List<VoiceRecord> findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long userId);
}
