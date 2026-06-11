package com.aitovoice.voice;

import com.aitovoice.voice.entity.UserPracticeProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PracticeProgressRepository extends JpaRepository<UserPracticeProgress, Long> {
    List<UserPracticeProgress> findByUserIdAndDeletedAtIsNull(Long userId);
    Optional<UserPracticeProgress> findByUserIdAndExerciseId(Long userId, Long exerciseId);
}
