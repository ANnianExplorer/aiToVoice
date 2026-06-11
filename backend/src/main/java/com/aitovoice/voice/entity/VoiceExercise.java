package com.aitovoice.voice.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "voice_exercises")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VoiceExercise extends BaseEntity {
    @Column(nullable = false, length = 200)
    private String title;
    @Column(length = 1000)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ExerciseType type;
    @Column(nullable = false)
    private Integer difficulty;
    @Column(name = "audio_example_path", length = 500)
    private String audioExamplePath;
    @Column(columnDefinition = "TEXT")
    private String instructions;
    @Column(name = "target_metrics", columnDefinition = "JSON")
    private String targetMetrics;
    @Column(name = "duration_sec")
    private Integer durationSec;
    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    public enum ExerciseType { BREATH, PITCH, RHYTHM, VIBRATO }
}
