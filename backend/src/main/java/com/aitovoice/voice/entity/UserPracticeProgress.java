package com.aitovoice.voice.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_practice_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "exercise_id"})
})
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE user_practice_progress SET deleted_at = NOW() WHERE id = ?")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class UserPracticeProgress extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private VoiceExercise exercise;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voice_record_id")
    private VoiceRecord voiceRecord;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PracticeStatus status = PracticeStatus.NOT_STARTED;
    @Column(name = "attempts_count")
    @Builder.Default
    private Integer attemptsCount = 0;
    @Column(name = "best_score")
    private Integer bestScore;
    @Column(name = "latest_score")
    private Integer latestScore;
    @Column(name = "practice_minutes")
    @Builder.Default
    private Integer practiceMinutes = 0;
    @Column(columnDefinition = "TEXT")
    private String notes;
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public enum PracticeStatus { NOT_STARTED, IN_PROGRESS, COMPLETED }
}
