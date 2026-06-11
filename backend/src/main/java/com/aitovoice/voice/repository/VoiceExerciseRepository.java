package com.aitovoice.voice.repository;

import com.aitovoice.voice.entity.VoiceExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VoiceExerciseRepository extends JpaRepository<VoiceExercise, Long> {
    List<VoiceExercise> findByTypeOrderBySortOrder(VoiceExercise.ExerciseType type);
    List<VoiceExercise> findAllByOrderBySortOrder();
}
